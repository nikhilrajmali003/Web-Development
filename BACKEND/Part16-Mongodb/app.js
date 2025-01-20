const express=require('express');
const app=express();

const userModel=require("./models/user");
const postModel=require("./models/posts");

app.get("/create",async function(req,res){
    let user = await userModel.create({
        username:"Nikhil Raj Mali",
        age:'22',
        email:"nikhil@gmail.com"
    })
})

app.post("/post/create",async function(req,res){
  let post=await postModel.create({
    postdata:"hello",

   })
   res.send(post);
})
app.get("/",function(req,res){
    res.send("Hello World");
})

app.listen(3001);