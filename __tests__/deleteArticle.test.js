const request = require('supertest');
const express = require('express');
const {deleteArticle} = require('../controllers/deleteArticle');
const {Article} = require("../models/articleSchema");
// Mock the Article model and Cloudinary uploader
jest.mock('../models/articleSchema');
jest.mock('../config/cloudinaryConfig', () => ({
    uploader:{
        destroy: jest.fn()
    }}));
const cloudinary = require('../config/cloudinaryConfig');
const app=express();
app.use(express.json());
// Mock authentication middleware
app.use((req,res,next)=>{
    req.user={userId:"user123"};
    next();
});
app.delete('/api/articles/:id',deleteArticle);
describe('DELETE /api/articles/:id',()=>{
    afterEach(()=>{
    jest.clearAllMocks();
    });

// Test successful deletion
test('should delete an article successfully',async()=>{
    Article.findById.mockResolvedValue({
        _id: 'article123', 
        author: 'user123', 
        coverImageUrl: 'https://res.cloudinary.com/demo/image/upload/v123/sample.jpg',
    });
    Article.findByIdAndDelete.mockResolvedValue({});
    const response=await request(app).delete('/api/articles/article123');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Article deleted successfully");
    expect(cloudinary.uploader.destroy).toHaveBeenCalled();
});

// Test article not found
test('should return 404 if article not found',async()=>{
    Article.findById.mockResolvedValue(null);
    const response=await request(app).delete('/api/articles/nonexistent');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Article not found");
});
// Test unauthorized deletion
test('should return 403 if user is not the author',async()=>{
    Article.findById.mockResolvedValue({
        _id: 'article123',
        author: 'differentUser',
        coverImageUrl: null,
    })
    const response=await request(app).delete('/api/articles/article123');
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Unauthorized to delete this article");
});
// Test server error
test('should return 500 if there is a server error',async()=>{
    Article.findById.mockRejectedValue(new Error("Database error"));
    const response=await request(app).delete('/api/articles/article123');
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Error deleting article");
});
});