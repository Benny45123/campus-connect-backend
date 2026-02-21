const express=require('express');
const {Register,Login, userSearch, authenticateToken}=require('../services/Authentication');
const router=express.Router();
const rateLimit=require('express-rate-limit');
const authLimiter=rateLimit({
    windowMs:15*60*1000, // 15 minutes
    max:10, // limit each IP to 10 requests per windowMs
    message:{message:"Too many authentication attempts from this IP, please try again after 30 minutes"}
});
router.post('/register',Register);
router.post('/login',authLimiter,Login);
router.get('/checkLogin',authenticateToken,userSearch);
module.exports=router;