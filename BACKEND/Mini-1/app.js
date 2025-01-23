const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

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
        req.user = decoded;  // Attach the user info to request object
        next();
    });
}

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Render login page
app.get('/login', (req, res) => {
    res.render('login'); // Ensure 'login.ejs' exists
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
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

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
});

// Protected Route Example (requires JWT)
app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userid);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ user });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Forgot Password Route
app.get('/forgot-password', (req, res) => {
    res.render('forgot-password'); // Render the page asking for the email
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).send("User not found");
    }

    // Generate a unique token for password reset (valid for 1 hour)
    const resetToken = jwt.sign({ email: user.email, userid: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Simulating an email being sent (replace with actual email service)
    console.log(`Password reset link: http://localhost:3000/reset-password/${resetToken}`);

    res.send('Password reset link has been sent to your email');
});

// Password Reset Route (to handle reset after clicking the link)
app.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;

    // Verify the reset token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).send('Invalid or expired token');
        }
        res.render('reset-password', { email: decoded.email, token: token });  // Render password reset form with email pre-filled
    });
});

app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Verify the reset token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(400).send('Invalid or expired token');
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password
        await userModel.updateOne({ _id: decoded.userid }, { password: hashedPassword });

        res.send('Password has been reset successfully');
    });
});

// Logout Route with redirect
app.get('/logout', isLoggedIn, (req, res) => {
    // Clear the JWT token from the cookies
    res.clearCookie('token');
    
    // Redirect to login page
    res.redirect('/login');
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
