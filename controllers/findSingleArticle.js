const {Article} = require('../models/articleSchema');

const findSingleArticle = async(req,res)=>{
    try{
        const {slug}=req.params;
        const article = await Article.findOne({slug,status:'published'}).populate('author','userName bio profilePictureUrl').lean();
        if (!article){
            return  res.status(404).json({message:"Article not found"});
        }
        res.status(200).json(article);
    }
    catch(error){
        console.error("Error finding single article:",error);
        res.status(500).json({message:"Error finding single article"});
    }
}
module.exports={findSingleArticle};