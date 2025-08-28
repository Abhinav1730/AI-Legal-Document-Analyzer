import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    googleId:{
        type:String,
        index:true,
        unique:true
    },
    name:{
        type:String
    },
    email:{
        type:String,
        index:true,
        sparse:true
    },
    profilePic:{
        type:String
    }
})

const User=mongoose.model("User",UserSchema)
export default User