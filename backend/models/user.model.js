import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    googleId:{
        type:String,
        index:true,
        unique:true
    },
    email:{
        type:String,
        index:true,
        sparse:true,
        lowercase:true,
        trim:true
    },
    passwordHash:{
        type:String,
        select:false
    },
    name:{
        type:String
    },
    profilePic:{
        type:String
    }
})

UserSchema.methods.comparePassword = async function(candidate){
    if(!this.passwordHash) return false;
    return bcrypt.compare(candidate, this.passwordHash);
}

UserSchema.statics.hashPassword = async function(password){
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

const User=mongoose.model("User",UserSchema)
export default User