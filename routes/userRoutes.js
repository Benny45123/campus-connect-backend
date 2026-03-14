const express = require('express');
const router = express.Router();
const {
    toggleFollow,
    getFollowing,
    getFollowers,
    getFollowingFeed,
    getUserProfile
} = require('../controllers/followController');
const {getUserArticles}=require('../controllers/UserArticles');
const { userSearch } = require('../services/Authentication');

router.get('/me', userSearch);                      // GET /api/user/me
router.get('/articles', getUserArticles);           // GET /api/user/articles
router.post('/follow/:userId', toggleFollow);       // POST /api/user/follow/:userId
router.get('/following', getFollowing);             // GET /api/user/following
router.get('/followers', getFollowers);             // GET /api/user/followers
router.get('/feed', getFollowingFeed);              // GET /api/user/feed
router.get('/profile/:userId', getUserProfile);     // GET /api/user/profile/:userId

module.exports = router;