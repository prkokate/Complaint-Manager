require('dotenv').config()
const JWT_SECRET=process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const fetchAdmin=(req,res,next)=>{
    const token = req.header('auth-token');

    if(!token){
        res.status(401).send({error:"access denied!"});
    }

        try{
            const decoded=jwt.verify(token,JWT_SECRET);
            req.admin=decoded.admin;
            next();
        }
        catch(err){
            console.log("Error", err);
            res.status(401).send({error:"access denied!"});
        }
    
}

module.exports=fetchAdmin;