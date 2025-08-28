import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import connectDB from "./config/db.js"

dotenv.config()
const app=express()

app.use(cors({origin:process.env.CLIENT_URL,credentials:true}))

connectDB()


const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}` )
})