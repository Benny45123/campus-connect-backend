const express=require('express');
const {Register,Login, userSearch, authenticateToken}=require('../services/Authentication');
const router=express.Router();
router.post('/register',Register);
router.post('/login',Login);
router.get('/checkLogin',authenticateToken,userSearch);
module.exports=router;