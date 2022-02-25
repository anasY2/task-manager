
const jwt=require("jsonwebtoken")
const User=require("../models/user")
const auth=async(req,res,next)=>{
    try {
      
       const token=req.cookies['auth_token']
        const decode=jwt.verify(token,process.env.TOKEN_SECRET)
       
         const user=await User.findOne({_id:decode._id,'tokens.token':token})
    if(!user){
       throw new Error()
    }
    req.user=user
    req.token=token
        next()
    } catch (error) {
       res.redirect("/")
    }
   
}
module.exports=auth