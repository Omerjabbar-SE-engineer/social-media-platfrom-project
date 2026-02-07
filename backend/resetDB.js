// resetDB.js
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");

// Connect to your MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/social-app")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const resetDB = async () => {
  try {
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("All users and posts have been deleted!");
  } catch (err) {
    console.error("Error clearing database:", err);
  } finally {
    mongoose.connection.close();
  }
};

resetDB();
