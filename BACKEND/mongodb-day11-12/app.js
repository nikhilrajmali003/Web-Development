const express = require("express"); // Importing the Express module to create an Express application.
const app = express(); // Creating an instance of an Express application.
const path=require('path'); 
// const userModel = require("./usermodel"); // Importing the user model (assumed to be a Mongoose model for interacting with MongoDB).
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
// Route to handle GET requests to the root URL ('/')
app.get("/", (req, res) => {
  res.render("index"); // Renders the 'index.ejs' view from the 'views' directory
});


app.get("/read",(req,res)=>{
  res.render("read");
})
  // Starting the server and making it listen for incoming requests on port 3000.
app.listen(3000, () => {
    // Logs a message to the console when the server is successfully running and listening on port 3000.
    console.log("Server running on port 3000");
  });