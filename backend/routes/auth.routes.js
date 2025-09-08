import express from "express"
import passport from "passport"
const router = express.Router()

import { getMe, logOut, register, login } from "../controllers/auth.controller.js"

// Google OAuth
router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))
router.get("/google/callback",passport.authenticate("google",{failureRedirect:(process.env.CLIENT_URL || "/")+"/login"}),
(req,res)=>{
    res.redirect((process.env.CLIENT_URL || "http://localhost:3000")+"/dashboard")
})

// JWT auth
router.post("/register", register)
router.post("/login", login)

router.get("/me",getMe)
router.post("/logout",logOut)

export default router