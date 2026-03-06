const request=require('supertest');
const express=require('express');
const {findArticle}=require('../controllers/findArticle');
const {Article}=require('../models/articleSchema');
const redisClient=require('../config/redis');
// Mock the Article model and Redis client
jest.mock('../models/articleSchema');
jest.mock('../config/redis', () => ({
    get: jest.fn(),
    setEx: jest.fn(),
}));
const app=express();
app.use(express.json());
app.get('/api/articles',findArticle);
//Test Tag Provided return 400 if no tag or keyword provided
test('should return 400 if no tag or keyword provided',async()=>{
    const response=await request(app).get('/api/articles');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Provide a search keyword or tag");
});
//Test Serving From Cache
test('should serve from cache if data exists',async()=>{
    const cachedResponse = {
        page: 1,
        limit: 10,
        totalArticles: 1,
        totalPages: 1,
        articles: [{ title: "Cached Article" }]
    };
    redisClient.get.mockResolvedValue(JSON.stringify(cachedResponse));
    const response=await request(app).get('/api/articles?q=test');
    expect(redisClient.get).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(cachedResponse);
});
//Fetching from DB if no cache and caching the result
test('should fetch from DB and cache the result if no cache exists',async()=>{
    redisClient.get.mockResolvedValue(null);
    const mockArticles = [
        { title: "DB Article", slug: "db-article" }
    ];
    Article.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockArticles)
    });
    Article.countDocuments.mockResolvedValue(1);
    redisClient.setEx.mockResolvedValue();
    const response=await request(app).get('/api/articles?q=test');
    expect(response.status).toBe(200);
    expect(response.body.articles).toEqual(mockArticles);
    expect(response.body.totalArticles).toBe(1);
    expect(redisClient.setEx).toHaveBeenCalled();
});
//Test Redis Cache Error Handling
test('should return 500 on unexpected error', async () => {
    redisClient.get.mockRejectedValue(new Error("Redis failure"));

    const res = await request(app).get('/api/articles?q=test');

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal Server Error");
});


