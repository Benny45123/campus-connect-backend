const {Article} = require('../models/articleSchema');
const User = require('../models/userSchema');
const clapArticle = async(req,res)=>{
    try{
        const {slug}=req.params;
        const article = await Article.findOneAndUpdate({slug,status:'published'},{$inc:{claps:1}});
        if(!article){
            return res.status(404).json({message:"Article not found"});
        }
        res.status(200).json({message:"Article clapped successfully",claps:article.claps+1});
    }
    catch(error){
        console.error("Error clapping article:",error);
        res.status(500).json({message:"Error clapping article"});
    }
}

const toggleSavedArticle = async (req, res) => {
    try {
        const { slug } = req.params;
        const article = await Article.findOne({ slug, status: 'published' });

        // ← was missing return, would continue and crash
        if (!article) return res.status(404).json({ message: 'Article not found' });

        const userId = req.user.userId;
        const alreadySaved = await User.findOne({ _id: userId, savedArticles: article._id });

        const update = alreadySaved
            ? { $pull:      { savedArticles: article._id } }
            : { $addToSet:  { savedArticles: article._id } };

        // ← was missing await, response could send before DB write finished
        await User.findByIdAndUpdate(userId, update);

        res.status(200).json({
            message: alreadySaved ? 'Article removed from saved list' : 'Article saved successfully'
        });
    } catch (error) {
        console.error('Error saving article:', error);
        res.status(500).json({ message: 'Error saving article' });
    }
};
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