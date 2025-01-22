const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');
const postModel=require('./models/posts')
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/register', async (req, res) => {
    try {
        const { email, password, username, name, age } = req.body;

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already registered');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const user = await userModel.create({
            email,
            username,
            name,
            age,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign({ email:email, userid: user._id }, 'shshhh');

        // Set the token in cookies
        res.cookie('token', token); 
        res.status(201).send('Registered successfully');
    } catch (error) {
        console.error('Error in /register:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
