const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,
    age: Number,
    username: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]  // ✅ Fix: Add 'posts' array
});

module.exports = mongoose.model("User", userSchema);
