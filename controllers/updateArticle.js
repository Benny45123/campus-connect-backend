const {Article}=require('../models/articleSchema');
const slugify=require('slugify');
const {generateTags}=require('../utils/generateTags');
const redisClient=require('../config/redis');
const updateArticle=async(req,res)=>{
    try{
        const articleId=req.params.id;
        const {title,content,coverImageUrl=null,tags=null,status}=req.body;
        const userName=req.user?.userName||"Unknown Author";
        const titleSlug=slugify(title,{lower:true,strict:true});
        let slug=titleSlug;
        let count=1;
        while (await Article.exists({slug})){
        slug=`${titleSlug}-${count++}`;
        }
        const normalizeTag = t =>t.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-");
            //readtime calculation
            const readTime=Math.ceil(content.reduce((acc,block)=>{
                if(block.type==='paragraph'){
                    const words=block.data.text.trim().split(/\s+/).length

                    return acc+words;
                }
                return acc;
            },0)/200);
        const generateAutoTags=generateTags(content,5);
        const allTags=Array.from(new Set([...(tags||[]),...generateAutoTags].map(normalizeTag))).slice(0,10);//max 10 tags
        const data={
            title,
            slug,
            author:req.user?.userId,
            authorName:userName,
            content,
            coverImageUrl: coverImageUrl || null,
            tags:allTags,
            status,
            readTime
        }
        if(article.author.toString()!==req.user.userId){
            return res.status(403).json({message:"Unauthorized to update this article"});
        }
        const article=await Article.findByIdAndUpdate(articleId,data);
        if(!article){
            return res.status(404).json({message:"Article not found"});
        }
        if (status==='published'){
            try{
                const keys=await redisClient.keys('articles:*');
                if(keys.length>0){
                    await redisClient.del(keys);
                    console.log(`Invalidated ${keys.length} cache entries after updating article`);
                }
            }
            catch(err){
                console.error("Error invalidating cache after updating article:",err);
            }
        }
        res.status(200).json({message:"Article updated successfully",article});

    }
    catch(error){
        console.error("Error updating article:",error);
        res.status(500).json({message:"Error updating article"});
    }

}
module.exports={updateArticle};