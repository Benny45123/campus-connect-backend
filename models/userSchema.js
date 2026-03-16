const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    rollNo:    { type: String, required: true, unique: true },
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    bio:       { type: String, default: '', maxLength: 200 },
    savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],

    // ── Follow system ──────────────────────────────────────────
    following:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users THIS user follows
    followers:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who follow THIS user
}, { timestamps: true });

// Virtual — don't store counts, derive them
userSchema.virtual('followingCount').get(function () { return this.following.length; });
userSchema.virtual('followersCount').get(function () { return this.followers.length; });

const User = mongoose.model('User', userSchema);
module.exports = User;