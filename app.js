const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const {authenticateToken}=require('./services/Authentication');
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true,origin:`http://localhost:5173`}));
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.error("Error connecting to MongoDB:",err);
});
const authRoutes=require('./routes/authRoutes');
app.use('/api/auth',authRoutes);
app.use(authenticateToken);
console.log("Authentication middleware applied to all routes below this line.");
app.get('/api',(req, res) => {
    res.send('API is running...');
})
app.listen(process.env.PORT||3000,()=>{
    console.log(`app is running on port ${process.env.PORT||3000}`);
});