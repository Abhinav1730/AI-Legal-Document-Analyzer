import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"
import passport from "passport"
import session from "express-session"
import passport from "./config/passport.js"




dotenv.config()
const app=express()

app.use(cors({origin:process.env.CLIENT_URL,credentials:true}))
app.use(passport.initialize())
app.use(passport.session())

connectDB()


const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}` )
})