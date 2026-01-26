const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:true,
});
//getting a sample image url from cloudinary to test configuration

const url=cloudinary.url('main-sample');

console.log("Generated Cloudinary URL:",url);

//generating a url with automatic format and quality selection

const url1=cloudinary.url('main-sample',{
    transformation:[{
        fetch_format:'auto',
        fetch_quality:'auto'
    }]
})

console.log("Generated Cloudinary URL:",url1);
//uploading a sample image to cloudinary to test configuration

(async function(){
    try{
        const uploadResult=await cloudinary.uploader.upload('./test-images/coverLetterPageDesign.png');
        console.log("Upload successful. Uploaded image URL:",uploadResult);
    }
    catch(error){
        console.error("Error uploading image to Cloudinary:",error);
    }
})();
