const express = require('express');
const cookieParser = require('cookie-parser'); // Import cookie-parser for parsing cookies
const jwt = require('jsonwebtoken'); // Import JWT for token creation and verification
const path = require('path'); // Path module for directory handling
const userModel = require("./models/user"); // User model for database interaction
const bcrypt = require('bcrypt'); // Bcrypt for password hashing
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse cookies
app.use(cookieParser());

// Route to render the home (index) page
app.get("/", function (req, res) {
    res.render('index'); // Render the 'index' EJS file
});

/**
 * Function to handle user creation
 * - Hashes the password before saving it to the database.
 * - Creates a new user in the database.
 * - Generates a JWT token and sends it as a cookie.
 */
app.post("/create", (req, res) => {
    let { username, email, password, age } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.status(500).send({ error: "Error hashing password" });

            try {
                let createdUser = await userModel.create({
                    username,
                    email,
                    password: hash,
                    age
                });
                let token = jwt.sign({ email }, "shshsh", { expiresIn: "1h" }); // Sign JWT with email and expiration
                res.cookie('token', token); // Set the token as a cookie
                res.status(201).send(createdUser); // Send created user as response
            } catch (err) {
                res.status(500).send({ error: "Error creating user", details: err.message });
            }
        });
    });
});

// Route to render the login page
app.get('/login', function (req, res) {
    res.render('login'); // Render the 'login' EJS file
});

/**
 * Function to handle user login
 * - Validates email and password against stored user data.
 * - If valid, generates a JWT token and sends it as a cookie.
 */
app.post('/login', async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.body.email }); // Find user by email
        if (!user) return res.status(404).send("User not found");

        bcrypt.compare(req.body.password, user.password, function (err, result) {
            if (err) return res.status(500).send("Error comparing passwords");

            if (result) {
                let token = jwt.sign({ email: user.email }, "shshsh", { expiresIn: "1h" }); // Sign JWT with expiration
                res.cookie('token', token); // Set token as a cookie
                res.send("Login successful");
            } else {
                res.status(401).send("Invalid credentials");
            }
        });
    } catch (err) {
        res.status(500).send({ error: "Error logging in", details: err.message });
    }
});

/**
 * Function to handle user logout
 * - Clears the JWT token cookie and redirects to the home page.
 */
app.get('/logout', function (req, res) {
    res.cookie("token", ""); // Clear the cookie by setting an empty value
    res.redirect('/'); // Redirect to home page
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
