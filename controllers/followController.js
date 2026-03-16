const User    = require('../models/userSchema');
const { Article } = require('../models/articleSchema');

// ── POST /api/user/follow/:userId ─────────────────────────────────────────────
// Toggle follow/unfollow. Returns new state + counts.
const toggleFollow = async (req, res) => {
    try {
        const targetId = req.params.userId;       // user to follow/unfollow
        const myId     = req.user.userId;         // logged-in user
         if (!targetId.match(/^[a-f\d]{24}$/i)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }


        if (targetId === myId)
            return res.status(400).json({ message: "You can't follow yourself" });

        const [me, target] = await Promise.all([
            User.findById(myId),
            User.findById(targetId)
        ]);

        if (!target) return res.status(404).json({ message: 'User not found' });

        const isFollowing = me.following.some(id => id.toString() === targetId);

        if (isFollowing) {
            // ── Unfollow ──
            me.following.pull(targetId);
            target.followers.pull(myId);
        } else {
            // ── Follow ──
            me.following.push(targetId);
            target.followers.push(myId);
        }

        await Promise.all([me.save(), target.save()]);

        res.status(200).json({
            following:       !isFollowing,               // new state
            followersCount:  target.followers.length,    // target's updated count
            followingCount:  me.following.length         // my updated count
        });
    } catch (error) {
        console.error('Error toggling follow:', error);
        res.status(500).json({ message: 'Error toggling follow' });
    }
};

// ── GET /api/user/following ───────────────────────────────────────────────────
// People I follow + their latest articles (like Medium's Following feed sidebar)
const getFollowing = async (req, res) => {
    try {
        const me = await User.findById(req.user.userId)
            .populate('following', 'name email bio followers following');

        // For each followed user, grab their 3 latest published articles
        const usersWithArticles = await Promise.all(
            me.following.map(async (user) => {
                const articles = await Article.find({
                    author: user._id,
                    status: 'published'
                })
                .sort({ createdAt: -1 })
                .limit(3)
                .select('title slug coverImageUrl readTime claps createdAt tags');

                return {
                    _id:            user._id,
                    name:           user.name,
                    email:          user.email,
                    bio:            user.bio,
                    followersCount: user.followers.length,
                    followingCount: user.following.length,
                    articles
                };
            })
        );

        res.status(200).json({
            following:      usersWithArticles,
            followingCount: me.following.length
        });
    } catch (error) {
        console.error('Error getting following:', error);
        res.status(500).json({ message: 'Error getting following' });
    }
};

// ── GET /api/user/followers ───────────────────────────────────────────────────
// People who follow me + whether I follow them back
const getFollowers = async (req, res) => {
    try {
        const me = await User.findById(req.user.userId)
            .populate('followers', 'name email bio followers following');

        const myFollowingIds = new Set(me.following.map(id => id.toString()));

        const followers = me.followers.map(user => ({
            _id:            user._id,
            name:           user.name,
            email:          user.email,
            bio:            user.bio,
            followersCount: user.followers.length,
            followingCount: user.following.length,
            iFollowBack:    myFollowingIds.has(user._id.toString()) // mutual?
        }));

        res.status(200).json({
            followers,
            followersCount: me.followers.length
        });
    } catch (error) {
        console.error('Error getting followers:', error);
        res.status(500).json({ message: 'Error getting followers' });
    }
};

// ── GET /api/user/feed?page=1&limit=10 ───────────────────────────────────────
// Paginated articles from everyone I follow (Medium's home feed)
const getFollowingFeed = async (req, res) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(20, parseInt(req.query.limit) || 10);
        const skip  = (page - 1) * limit;

        const me = await User.findById(req.user.userId).select('following');

        if (!me.following.length) {
            return res.status(200).json({ articles: [], total: 0, page, hasMore: false });
        }

        const [articles, total] = await Promise.all([
            Article.find({
                author: { $in: me.following },
                status: 'published'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('title slug coverImageUrl readTime claps tags createdAt authorName author'),

            Article.countDocuments({
                author: { $in: me.following },
                status: 'published'
            })
        ]);

        res.status(200).json({
            articles,
            total,
            page,
            hasMore: skip + articles.length < total
        });
    } catch (error) {
        console.error('Error getting feed:', error);
        res.status(500).json({ message: 'Error getting feed' });
    }
};

// ── GET /api/user/profile/:userId ────────────────────────────────────────────
// Public profile: stats + published articles + follow state
const getUserProfile = async (req, res) => {
    try {
        const targetId = req.params.userId;
        // Guard against malformed IDs
        if (!targetId || targetId === '[object Object]') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Validate it's a proper ObjectId before hitting DB
        if (!targetId.match(/^[a-f\d]{24}$/i)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        const myId     = req.user?.userId;

        const [target, articles] = await Promise.all([
            User.findById(targetId).select('name email bio following followers createdAt'),
            Article.find({ author: targetId, status: 'published' })
                .sort({ createdAt: -1 })
                .select('title slug coverImageUrl readTime claps tags createdAt')
        ]);

        if (!target) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            profile: {
                _id:            target._id,
                name:           target.name,
                bio:            target.bio,
                followersCount: target.followers.length,
                followingCount: target.following.length,
                memberSince:    target.createdAt,
                // Is the logged-in user following this profile?
                isFollowing:    myId ? target.followers.map(id => id.toString()).includes(myId) : false,
            },
            articles
        });
    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Error getting profile' });
    }
};

module.exports = { toggleFollow, getFollowing, getFollowers, getFollowingFeed, getUserProfile };