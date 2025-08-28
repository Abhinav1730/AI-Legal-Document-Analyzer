import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET
const CALLBACK_URL=process.env.CALLBACK_URL || "/api/auth/google/callback"
const GoogleStrategy=Strategy

if(!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET){
    console.warn("Google auth credentials not found in backend")
}

passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL:CALLBACK_URL
},
async(accessToken,refreshToken,profile,done)=>{
    try {
        const googleId=profile.id
        let user=await User.findOne({googleId})
        if(!user){
            user=await User.create({
                googleId,
                name:profile.displayName,
                email:profile.emails && profile.emails[0]?profile.emails[0].value:undefined,
                profilePic:profile.photos && profile.photos[0]?profile.photos[0].value:undefined
            })
        }
        return done(null,user)
    } catch (error) {
        return done(error,null)
    }
}))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})
passport.deserializeUser(async(id,done)=>{
    try {
        const user=await User.findById(id).lean()
        done(null,user)
    } catch (err) {
        done(err,null)
    }
})

export default passport