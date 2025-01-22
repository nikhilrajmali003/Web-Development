// protocols - rules 
// NOTE :- http 
// const http=require('http');

// const server=http.createServer(function(req,res){
// res.end("hello world");
// })
// server.listen();
// console.log("server is start");
// NOTE - Express js used for backend and its framework , and manages everything from receiving the request and giving the response....!

// NOTE - setting express js 
const express=require('express');
const app=express();
// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(function(req,res,next){
    console.log("middle ware chalaoo");
    next(); //forward request next postion
})
app.use(function(req,res,next){
    console.log("middle ware chalaao ek aur baar");
    next(); //forward request next postion
})
app.get('/',function(req,res){
    res.send('champion mera anuj');
});
app.get("/about",function(req,res){
    res.send("about page");
})
app.get("/profile",function(req,res,next){
    // res.send("profile page");
    // return next(new Error("Something went wrong "));
    res.send("done")
})
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

app.listen(3000);
console.log("server is start");  // NOTE - this is the basic server and it will run 

// NOTE :- Middleware - jab bhi server request accept karta hai waha se route ke beech pahuchne tak agar aap us request ko beech  me rokte ho and kuch perform karte ho, to yeh element middleware kehlata hai 