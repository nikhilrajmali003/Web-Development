const express = require("express"); // Importing the Express module to create an Express application.
const app = express(); // Creating an instance of an Express application.
const path = require('path'); 
const userModel = require('./models/user'); // Importing the user model for MongoDB interactions.

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.set('view engine', 'ejs'); // Set EJS as the templating engine

// Route to handle GET requests to the root URL ('/')
app.get("/", (req, res) => {
    res.render("index"); // Render the 'index.ejs' view
});


// Route to read users
app.get("/read", async (req, res) => {
    try {
        const users = await userModel.find(); // Fetch all users
        res.render("read", { users }); // Pass users to the EJS template
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Server Error"); // Send a 500 error for server issues
    }
});


// Route to create a new user
app.post("/create", async (req, res) => {
    const { name, email, image } = req.body; // Destructure incoming data
    try {
        const createdUser = await userModel.create({ name, email, image }); // Create a new user
        res.redirect('/read'); // Redirect to the '/read' route after creation
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Server Error"); // Send a 500 error for server issues
    }
});

// Route to delete a user by ID
app.get('/delete/:id', async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id); // Find and delete the user by ID
        res.redirect('/read'); // Redirect to the '/read' page after deletion
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Server Error"); // Send a 500 error for server issues
    }
});
app.get('/edit/:userid',async(req,res)=>{
    let user=await userModel.findOne({_id:req.params.userid});
    res.render("edit",{user});
})

app.post('/update/:userid',async(req,res)=>{
    let {image,name,email}=req.body;
    let user=await userModel.findOneAndUpdate({_id:req.params.userid},{image,name,email},{new:true});
    res.redirect("/read");
})
// Starting the server and making it listen for incoming requests on port 3000.
app.listen(3000, () => {
    console.log("Server running on port 3000"); // Log a message when the server is running
});
