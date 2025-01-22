const express = require('express');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const bcrypt=require('bcrypt');
const app = express();
const jwt=require('jsonwebtoken');
// Use cookie-parser middleware
app.use(cookieParser());

// app.get("/", function (req, res) {
//     res.cookie("name", "harsh"); // Set the cookie
//     res.send("Cookie has been set!");
// });

// app.get("/read", function (req, res) {
//     console.log(req.cookies); // read the cookie
//     res.send("read page");
// });

// app.get("/", function (req, res) {
//     bcrypt.genSalt(10, function (err, salt) {
//         if (err) {
//             console.error("Error generating salt:", err);
//             return res.status(500).send("Internal Server Error");
//         }
//         bcrypt.hash("nikhil0031", salt, function (err, hash) {
//             if (err) {
//                 console.error("Error hashing password:", err);
//                 return res.status(500).send("Internal Server Error");
//             }
//             console.log(hash); // Log the generated hash
//             res.send(`Generated Hash: ${hash}`); // Send the hash as a response
//         });
//     });
// });
app.get("/",function(req,res){
    let token= jwt.sign({email : "nikhilrajmali@gmail.com"},"secret");
    res.cookie("token",token)
    console.log(token);
    res.send("Done...!")
})
app.get("/read",function(req,res){
    console.log(req.cookies.token);
    let data=jwt.verify(req.cookies.token,"secret");
    console.log(data);
})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
