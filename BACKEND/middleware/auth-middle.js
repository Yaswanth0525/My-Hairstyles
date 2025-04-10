const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    // console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(token);
    if(!token){
        return res.status(401).json({
            success: false,
              message: 'Unauthorized User',
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        req.userInfo = decoded;
        next();
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Server Error',  
        })
    }
}

module.exports = authMiddleware; 