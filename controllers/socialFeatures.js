const {Article} = require('../models/articleSchema');
const User = require('../models/userSchema');
const clapArticle = async(req,res)=>{
    try{
        const {slug}=req.params;
        const article = await Article.findOne({slug,status:'published'});
        if(!article){
            return res.status(404).json({message:"Article not found"});
        }
        article.claps+=1;
        await article.save();
    }
    catch(error){
        console.error("Error clapping article:",error);
        res.status(500).json({message:"Error clapping article"});
    }
}

const toggleSavedArticle = async(req,res)=>{
    try{
        const {slug}=req.params;
        const article = await Article.findOne({slug,status:'published'});
        if(!article){
            res.status(404).json({message:"Article not found"});
        }
        const userId=req.user.userId;
        const user=await User.findById(userId);
        if (!user){ return res.status(404).json({message:"User not found"}); }
        const alreadySaved=user.savedArticles.includes(article._id);
        if(alreadySaved){
            user.savedArticles=user.savedArticles.filter(id=>!id.equals(article._id));
        }
        else{
            user.savedArticles.push(article._id);
        }
        await user.save();
        res.status(200).json({messsage:alreadySaved?"Article removed from saved list":"Article saved successfully"});


    }
catch(error){ 
    console.error("Error saving article:",error); res.status(500).json({message:"Error saving article"}); 
}
}
const getSavedArticles=async(req,res)=>{
    try{
        const user=await User.findById(req.user.userId)
        if(!user){ return res.status(404).json({message:"User not found"}); }
        const savedArticles=await user.populate({
            path:'savedArticles',
            match:{status:'published'},
            select:'title coverImageUrl tags readTime claps createdAt author authorName slug',
        });
        res.status(200).json({savedArticles:savedArticles.savedArticles,author:savedArticles.savedArticles.map(article=>article.author)});
    }
    catch(error){
        console.error("Error retrieving saved articles:",error);
        res.status(500).json({message:"Error retrieving saved articles"});
    }
}
module.exports={clapArticle,toggleSavedArticle,getSavedArticles};