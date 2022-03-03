
const mongoose=require("mongoose");
const validator=require("validator")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require("./task")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        validate(value){
          if(value.length<=1){
throw new Error("Short name!!!")
          }
        }
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        required:true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email!!!")
            }
        }
    },
    password:{
        type:String,
        required:true,
        
        validate(value){
            if(value.includes("password")){
                throw new Error("Password should not contain password!!!")
            }else if(value.length <6){
                throw new Error("Too short!!!")
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                
            }
        }
    ]
})
userSchema.methods.generateAuthToken= async function(){
    const token=jwt.sign({_id:this._id.toString()},process.env.TOKEN_SECRET,{expiresIn:60*60})
    this.tokens=this.tokens.concat({token})
    await this.save()
    return token
}
userSchema.pre('save',async function(next){
if(this.isModified("password")){
  const hashPassword=  await bcrypt.hash(this.password,8)
  this.password=hashPassword
}
next()
})
userSchema.pre('remove',async function(next){
await Task.deleteMany({owner:this._id})
next()
})
const User=mongoose.model("User",userSchema)
module.exports=User