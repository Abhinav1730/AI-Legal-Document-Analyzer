import mongoose from "mongoose";

const annotationSchema = new mongoose.Schema({
    type:String,
    snippet:String,
    start:Number,
    end:Number,
    confidence:Number
},{_id:false})

const documentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index:true
    },
    originalName:String,
    fileName:String,
    mimeType:String,
    text:String,
    annotations:[annotationSchema]
},{timestamps:true})

const Document = mongoose.model("Document",documentSchema)
export default Document