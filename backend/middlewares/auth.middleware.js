import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

const isAuthenticated = (req , res , next)=>{
    // Accept passport session OR JWT bearer
    if(req.isAuthenticated && req.isAuthenticated()){
        return next();
    }
    const auth = req.headers.authorization || "";
    if(auth.startsWith("Bearer ")){
        const token = auth.slice(7);
        try{
            const payload = jwt.verify(token, JWT_SECRET);
            req.jwtUser = payload;
            return next();
        }catch(err){
            return res.status(401).json({ error: "Invalid token" });
        }
    }
    return res.status(401).json({error : "Unauthorised User"})
}

export default isAuthenticated