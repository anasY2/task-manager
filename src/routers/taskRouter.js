const express=require('express');
const Task = require('../models/task');
const auth=require("../middleware/auth")
const app=express();
const route= new express.Router()
//Task Page
route.get("/tasks",auth,async(req,res)=>{
    const tasks=await Task.find({owner:req.user._id})
   
    res.render("task",{
        name:req.user.name,
        tasks:tasks
    })
})
//Create Task
route.post("/user/task",auth,async(req,res)=>{
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try {
        await task.save()
       res.redirect("/tasks")
    } catch (error) {
        res.status(400).send(error.message)
    }
})
//Delete Task
route.get("/task/delete/:id",auth,async(req,res)=>{
try {
  const task=await Task.findByIdAndRemove(req.params.id)
   if(!task){
       throw new Error("Not found")
   }
res.redirect("/tasks")
} catch (error) {
    res.status(400).send(error.message)
}
})
module.exports=route