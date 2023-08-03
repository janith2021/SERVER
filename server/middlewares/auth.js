const jwt = require('jsonwebtoken')

const authenticateuser = async(req,res,next) =>{
    if(req.headers.authorization){
        try {
           const jwttoken = req.headers.authorization.split(" ")[1];
           const decodejwttoken = await jwt.verify(
             jwttoken,
             process.env.JWTSECRET
           );

           req.email = decodejwttoken;

           next(); 
        } catch (error) {
            if (error.message === "jwt expired"){
                res.json({message : "Session Expired" , type : "error"})
            }
            else{
                res.json(error);
            }
             
        }
        
    }else{
        res.json({message : "You Are Not Authorized"})
    }
    
}

module.exports = authenticateuser;