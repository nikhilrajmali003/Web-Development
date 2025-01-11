const express = require('express');
// const cookieParser = require('cookie-parser'); // Import cookie-parser
const bcrypt=require('bcrypt');
const app = express();

// Use cookie-parser middleware
// app.use(cookieParser());

// app.get("/", function (req, res) {
//     res.cookie("name", "harsh"); // Set the cookie
//     res.send("Cookie has been set!");
// });

// app.get("/read", function (req, res) {
//     console.log(req.cookies); // read the cookie
//     res.send("read page");
// });

app.get("/",function(req,res){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("nikhil0031", salt, function(err, hash) {
            // Store hash in your password DB.
            console.log(hash);
        });
    });
})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
