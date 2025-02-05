const mongoose = require("mongoose");

// Correct MongoDB connection string
mongoose.connect("mongodb://127.0.0.1:27017/miniproject") 


const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to User model
        required: true
    },
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"  // Reference to User model for likes
    }]
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

