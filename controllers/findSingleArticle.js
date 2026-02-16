const {Article} = require('../models/articleSchema');
const User = require('../models/userSchema');

const findSingleArticle = async(req,res)=>{
    try{
        const {slug}=req.params;
        const article = await Article.findOne({slug,status:'published'}).populate('author','userName bio profilePictureUrl').lean();
        if (!article){
            return  res.status(404).json({message:"Article not found"});
        }
        let hasSaved=false;
        if(req.user){
            const userId=req.user.userId;
            const user=await User.findById(userId);
            if(user){
                hasSaved=user.savedArticles.some(id=>id.equals(article._id));
            }
        }
        res.status(200).json({article,hasSaved});
    }
    catch(error){
        console.error("Error finding single article:",error);
        res.status(500).json({message:"Error finding single article"});
    }
}
module.exports={findSingleArticle};