const {Article} = require('../models/articleSchema');

const getUserArticles = async(req,res)=>{
    try{
        const userId=req.user.userId;
        const articles=await Article.find({author:userId}).sort({createdAt:-1});
        res.status(200).json({articles});
    }
    catch(error){
        console.error("Error retrieving user articles:",error);
        res.status(500).json({message:"Error retrieving user articles"});
    }
}
module.exports={getUserArticles};