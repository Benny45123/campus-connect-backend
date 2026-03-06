const request=require('supertest');
const express=require('express');
const {findSingleArticle}=require('../controllers/findSingleArticle');
const {Article}=require('../models/articleSchema');
const User=require('../models/userSchema');
jest.mock('../models/articleSchema');
jest.mock('../models/userSchema');
const app=express();
app.use(express.json());
// Mock authentication middleware
app.use((req,res,next)=>{
    req.user = {userId:"user123"};
    next();
});
app.get('/api/articles/:slug',findSingleArticle);
// Test successful retrieval
test('should retreive an article successfully',async()=>{
    const mockArticle={
        _id: 'article123',
        slug: 'test-article',
        status: 'published',
    };
    Article.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
        lean:jest.fn().mockResolvedValue(mockArticle)
        })
    });
    User.findById.mockResolvedValue({
        savedArticles: [{
            equals: (id) => id === 'article123'
        }]
    });
    const response=await request(app).get('/api/articles/test-article');
    expect(response.status).toBe(200);
    expect(response.body.article).toEqual(mockArticle);
    expect(response.body.hasSaved).toBe(true);
});