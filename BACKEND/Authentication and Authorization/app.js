const express = require('express');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse cookies
app.use(cookieParser());

// Route to render the index page
app.get("/", function(req, res) {
    res.render('index'); // Render the 'index' EJS file
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
