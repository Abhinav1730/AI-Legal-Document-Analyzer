import express from "express"
import passport from "passport"
const router = express.Router()

import {getMe,logOut} from "../controllers/auth.controller.js"

router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))
router.get("/google/callback",passport.authenticate("google",{failureRedirect:(process.env.CLIENT_URL || "/")+"/login"}),
(req,res)=>{
    res.redirect((process.env.CLIENT_URL || "http://localhost:5173")+"/dashboard")
})

router.get("/me",getMe)
router.get("/logout",logOut)

export default router