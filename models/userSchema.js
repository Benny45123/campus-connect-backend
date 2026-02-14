const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    rollNo:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    savedArticles:
    [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Article'
    }]
},{timestamps:true});
const User=mongoose.model('User',userSchema);
module.exports=User;