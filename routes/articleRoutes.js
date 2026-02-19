const express=require('express');
const {postArticle}=require('../controllers/postArticle');
const {uploadImage}=require('../controllers/uploadImage');
// const {authenticateToken}=require('../services/Authentication');
const {findArticle}=require('../controllers/findArticle');
const {findSingleArticle}=require('../controllers/findSingleArticle');
const {getUserArticles}=require('../controllers/UserArticles');
const {clapArticle,toggleSavedArticle}=require('../controllers/socialFeatures');
const multer=require('multer');
const rateLimit=require('express-rate-limit');
const router=express.Router();
const upload=multer({storage:multer.memoryStorage()});

const postArticleLimiter=rateLimit({
    windowMs:60*60*1000, // 1 hour
    max:5, // limit each IP to 5 article posts per windowMs
    message:{message:"Too many articles posted from this IP, please try again after an hour"}
});

router.post('/article/post',postArticleLimiter,postArticle);
router.post('/article/upload-image',postArticleLimiter,upload.single("image"),uploadImage);
router.get('/article/search',findArticle);
router.get('/article/:slug',findSingleArticle);
router.post('/article/:slug/clap',clapArticle);
router.get('/article/user/articles',getUserArticles);
router.post('/article/:slug/save',toggleSavedArticle);
module.exports=router;
