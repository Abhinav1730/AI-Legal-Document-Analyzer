import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN = "7d";

const signToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        if(!email || !password) return res.status(400).json({ error: "Email and password are required" });

        const existing = await User.findOne({ email });
        if(existing) return res.status(409).json({ error: "Email already in use" });

        const passwordHash = await User.hashPassword(password);
        const user = await User.create({ name: name || email.split("@")[0], email, passwordHash });

        const token = signToken(user);
        res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if(!email || !password) return res.status(400).json({ error: "Email and password are required" });

        const user = await User.findOne({ email }).select("+passwordHash name email");
        if(!user) return res.status(401).json({ error: "Invalid credentials" });
        const ok = await user.comparePassword(password);
        if(!ok) return res.status(401).json({ error: "Invalid credentials" });

        const token = signToken(user);
        res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
}

export const getMe= async (req,res)=> {
    // If Google session is present
    if(req.user){
        return res.json({ user: req.user });
    }
    // Else if JWT auth middleware set req.jwtUser
    if(req.jwtUser){
        const user = await User.findById(req.jwtUser.id).lean();
        return res.json({ user });
    }
    return res.status(401).json({error:"Not Logged In"})
}

export const logOut=(req,res)=>{
    // For Google/passport session logout
    if(req.logOut){
        req.logOut(err=>{
            if(err) return res.status(500).json({error:"Logout failed"})
            res.json({message:"Logged Out Successfully"})
        })
    } else {
        // For JWT, client should just discard token
        res.json({message:"Logged Out (client should discard JWT)"})
    }
}