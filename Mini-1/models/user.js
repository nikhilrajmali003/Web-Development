const mongoose = require("mongoose");

// Correct MongoDB connection string
mongoose.connect("mongodb://127.0.0.1:27017/miniproject") 

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  age: Number,
  username: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]  // ✅ Fix: Add 'posts' array
});

module.exports = mongoose.model("User", userSchema);
