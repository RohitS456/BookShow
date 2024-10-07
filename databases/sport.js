const mongoose=require("mongoose");
const sportSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    place:{
        type:String,
        required:true
    }
});
const Sport=mongoose.model("Sport",sportSchema);
module.exports=Sport;