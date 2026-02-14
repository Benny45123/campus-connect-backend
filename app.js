const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const articleRoutes=require('./routes/articleRoutes');
const {authenticateToken}=require('./services/Authentication');
const {getSavedArticles}=require('./controllers/socialFeatures');
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:[`https://campus-connect-i4hy.vercel.app`,`https://campus-connect-i4hy-git-main-beazawada-bennyhinns-projects.vercel.app`,`https://campus-connect-i4hy-9dcv2udm1-beazawada-bennyhinns-projects.vercel.app`],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB:",err);
});
const authRoutes=require('./routes/authRoutes');
app.use('/api/auth',authRoutes);
app.use(authenticateToken);
// console.log("Authentication middleware applied to all routes below this line.");
app.post('/api/logout',(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        sameSite:"none",
        secure:true,
    });
    res.status(200).json({message:"Logout successful"});
})
app.get('/api/library/saved',getSavedArticles);
app.use('/api',articleRoutes);
app.get('/api',(req, res) => {
    res.send('API is running...');
});
app.listen(process.env.PORT||3000,()=>{
    console.log(`app is running on port ${process.env.PORT||3000}`);
});