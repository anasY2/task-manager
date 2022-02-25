require("./db/mongoose")
const express=require('express');
const path=require('path');
const hbs=require('hbs');
const port=process.env.PORT

const cookieParser=require("cookie-parser")
const public=path.join(__dirname,"../public")
const partialPath=path.join(__dirname,"../views/partials")
const userRouter=require("./routers/userRouter")
const taskRouter=require("./routers/taskRouter")
const app=express();
app.use(express.static(public))
app.set('view engine',"hbs")
hbs.registerPartials(partialPath)
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(userRouter)
app.use(taskRouter)
app.get("/*",(req,res)=>{
    res.sendFile(path.join(public,"404page.html"))
})

app.listen(port,()=>{
    console.log("Server running on "+port+"...");
})
