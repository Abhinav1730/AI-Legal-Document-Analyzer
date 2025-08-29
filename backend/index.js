import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"
import session from "express-session"
import passport from "./config/passport.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"




dotenv.config()
const app=express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir=path.join(__dirname,"uploads")
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

app.use(cors({origin:process.env.CLIENT_URL,credentials:true}))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())


connectDB()


const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}` )
})