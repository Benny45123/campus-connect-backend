const {Article}=require('../models/articleSchema');
const slugify=require('slugify');
const {generateTags}=require('../utils/generateTags');
const postArticle=async (req,res)=>{
    try{
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
        const article=await Article.create({
            title,
            slug,
            author:req.user?.userId,
            authorName:userName,
            content,
            coverImageUrl: coverImageUrl || null,
            tags:allTags,
            status,
            readTime
        });
        res.status(201).json({message:"Article posted successfully",article});
    }
    catch(error){
        console.error("Error posting article:",error);
        res.status(500).json({message:"Error posting article"});
    }
}
module.exports={postArticle};