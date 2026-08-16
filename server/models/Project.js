const mongoose=require("mongoose")

const projectSchema=new mongoose.Schema({


    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    technologies:{
        type:[String],
        required:true
    },
    githubLink:{
        type:String,
        required:true
    },
    liveUrl:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
  
});
module.exports=mongoose.model("Project",projectSchema)