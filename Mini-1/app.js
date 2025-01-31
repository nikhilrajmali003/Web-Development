const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const crypto = require("crypto"); // For generating reset tokens
const userModel = require("./models/user");
const Post = require("./models/post"); // Assuming you have a Post model
const session = require('express-session');
const nodemailer = require('nodemailer');


const JWT_SECRET = process.env.JWT_SECRET || "fallbackSecret";

const app = express();

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Change to true for production with HTTPS
}));


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("Hi!"));
app.get("/create", (req, res) => res.render("index"));
app.get("/login", (req, res) => res.render("login"));
app.get("/profile", isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render("profile",{user})
        
    
});

// Post creation
app.post("/post", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });  // ✅ Fix: Correct variable name
    let { content } = req.body;

    let post = await Post.create({
        userId: user._id,  // ✅ Fix: Ensure it matches Post schema
        username: user.username,  // ✅ Include username
        content
    });

    user.posts.push(post._id);  // ✅ Fix: Use 'posts' (plural)
    await user.save();

    res.redirect("/profile");
});
app.get("/like/:id",isLoggedIn,async(req,res)=>{
    let post=await postModel.findOne({_id:req.params.id}).populate("user");
    if(post.likes.indecOf(req.user.userid)==-1){
        post(.like.push(req.user.user.id  );

    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userid),1);
    }
    await post.save()
    res.redirect("/profile",{user});
})
// ✅ Logout (Properly clears the token)
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});
app

// ✅ Register Route
app.post("/register", async (req, res) => {
    try {
        const { email, password, username, name, age } = req.body;

        let existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).send("User already registered");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser = await userModel.create({ username, email, age, name, password: hashedPassword });

        let token = jwt.sign({ email: user.email, userid: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, { httpOnly: true });
        res.send("Registered successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error during registration");
    }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }

        let token = jwt.sign({ email: user.email, userid: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, { httpOnly: true });
        res.status(200).redirect("/profile");
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("Login failed, please try again.");
    }
});

// ✅ Middleware: Check if user is logged in
function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        console.log("No token found in cookies");
        return res.status(401).send("Unauthorized: No token provided");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Attach the decoded user data to the request
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).send("Unauthorized: Invalid token");
    }
}


// ✅ Forgot Password - Show Form
app.get("/forgot-password", (req, res) => {
    res.render("forgot-password", { errorMessage: null });
});

// ✅ Process Forgot Password Request
app.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.render("forgot-password", { errorMessage: "User not found" });
        }

        // Generate reset token (unhashed for email, hashed for database)
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // Save token with expiration (1 hour)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        // Send reset password email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
        transporter.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            text: `Click the link to reset your password: ${resetLink}`,
        }).then(() => {
            console.log(`Password reset link sent to ${user.email}`);
        }).catch((err) => {
            console.error("Error sending reset email:", err);
        });

        return res.render("forgot-password", { errorMessage: "Password reset link sent. Check your email." });
    } catch (err) {
        console.error(err);
        res.render("forgot-password", { errorMessage: "Error processing request" });
    }
});

// ✅ Show Reset Password Form
app.get("/reset-password/:token", async (req, res) => {
    const { token } = req.params;

    // Find the user with valid reset token and not expired
    const user = await userModel.findOne({
        resetPasswordToken: { $exists: true },
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.render("reset-password", { token, errorMessage: "Invalid or expired token" });
    }

    res.render("reset-password", { token, errorMessage: null });
});

// ✅ Process Reset Password
app.post("/reset-password/:token", async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        // Find the user with a valid reset token
        const user = await userModel.findOne({
            resetPasswordToken: { $exists: true },
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.render("reset-password", { token, errorMessage: "Invalid or expired token" });
        }

        // Compare token
        const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isMatch) return res.render("reset-password", { token, errorMessage: "Invalid token" });

        // Hash the new password
        user.password = await bcrypt.hash(password, 10);

        // Remove token fields from the user
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send("Password reset successful. You can now log in.");
    } catch (err) {
        console.error(err);
        res.render("reset-password", { token: req.params.token, errorMessage: "Error resetting password" });
    }
});

// Start server
app.listen(3001, () => console.log("Server running on port 3001"));
