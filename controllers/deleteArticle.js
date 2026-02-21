const {Article} = require("../models/articleSchema");
const cloudinary=require('../config/cloudinaryConfig');
const getPublicIdFromUrl = (url) => {
    // Captures everything (the Public ID) until the last "." (the extension)
    const regex = /\/upload\/(?:v\d+\/)?(.+)\./;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

const deleteArticle=async(req,res)=>{
    try{
        const articleId=req.params.id;
        const article=await Article.findById(articleId);
        if(!article){
            return res.status(404).json({message:"Article not found"});
        }
        if(article.author.toString()!==req.user.userId){
            return res.status(403).json({message:"Unauthorized to delete this article"});
        }
        // If the article has a cover image, delete it from Cloudinary
        if(article.coverImageUrl){
            const publicId=getPublicIdFromUrl(article.coverImageUrl);
            if(publicId){
                await cloudinary.uploader.destroy(publicId);
            }
        }
        await Article.findByIdAndDelete(articleId);
        res.status(200).json({message:"Article deleted successfully"});
    }
    catch(error){
        console.error("Error deleting article:",error);
        res.status(500).json({message:"Error deleting article"});
    }
}
module.exports={deleteArticle};
