const mongoose=require("mongoose");
const movieSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true,
    },
    title:{
       type:String,
       required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
    language:{
        type:String,
        required:true,
    }
});
const Movie=mongoose.model("Movie",movieSchema);
module.exports=Movie;