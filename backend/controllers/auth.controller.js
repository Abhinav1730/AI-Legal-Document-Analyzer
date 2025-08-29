export default function getMe (req,res) {
    if(!req.user) return res.status(401).json({error:"Not Logged In"})
    res.json(req.user)
}

export default function logOut(req,res){
    req.logOut(err=>{
        if(err) return res.status(500).json({error:"Logout failed"})
        res.json({message:"Logged Out Successfully"})
    })
}