const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const userModel = require('./models/user');
require('dotenv').config();

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}

// Nodemailer configuration for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Token verification middleware
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send("You must be logged in");
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send("Invalid or expired token");
        }
        req.user = decoded; // Attach the user info to request object
        next();
    });
}

// Rate limiting middleware for sensitive routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later",
});

// Routes
app.get('/', (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/profile');
    }
    res.render('index');
});

// Render login page
app.get('/login', (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/profile');
    }
    res.render('login');
});

// Register Endpoint
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
        const token = jwt.sign({ email: email, userid: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Set the token in cookies with security flags
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(201).send('Registered successfully');
    } catch (error) {
        console.error('Error in /register:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Login Endpoint
app.post('/login', limiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid credentials");
        }

        // Generate a JWT token
        const token = jwt.sign({ email: user.email, userid: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Set the token in cookies
        res.cookie('token', token, { httpOnly: true });

        // Redirect to profile page
        res.redirect('/profile');
    } catch (error) {
        console.error('Error in /login:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Protected Route: Profile
app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('profile', { user });
    } catch (error) {
        console.error('Error in /profile:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Forgot Password Route
app.get('/forgot-password', (req, res) => {
    res.render('forgot-password'); // Render the page asking for the email
});

app.post('/forgot-password', limiter, async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const resetToken = jwt.sign({ email: user.email, userid: user._id }, JWT_SECRET, { expiresIn: '1h' });

        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link is valid for 1 hour.</p>`,
        });

        res.send('Password reset link has been sent to your email');
    } catch (error) {
        console.error('Error in /forgot-password:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Password Reset Route
app.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).send('Invalid or expired token');
        }
        res.render('reset-password', { email: decoded.email, token });
    });
});

app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(400).send('Invalid or expired token');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await userModel.updateOne({ _id: decoded.userid }, { password: hashedPassword });

        res.send('Password has been reset successfully');
    });
});

// Logout Route
app.get('/logout', isLoggedIn, (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
