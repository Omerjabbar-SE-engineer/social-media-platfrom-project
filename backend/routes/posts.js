const express = require("express");
const router = express.Router();
const multer = require("multer");
const Post = require("../models/Post");
const path = require("path");
const fs = require("fs");

// ---------------- Ensure uploads folder exists ----------------
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ---------------- Multer setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------- GET all posts ----------------
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("GET posts error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- CREATE post ----------------
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { user, userId, description, duration } = req.body;

    if (!user) return res.status(400).json({ message: "User is required" });
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Save duration if provided (in seconds)
    const newPost = new Post({
      user,
      userId,
      description,
      file: filePath,
      duration: Number(duration) || 0, // <-- new field
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    console.error("POST creation error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- LIKE post ----------------
router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = req.body.user || "anonymous";

    if (!post.likes.includes(user)) {
      post.likes.push(user);
      await post.save();
    }

    res.json(post);
  } catch (err) {
    console.error("LIKE post error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- COMMENT post ----------------
router.post("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { user, text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    post.comments.push({
      user: user || "anonymous",
      text,
      createdAt: new Date(),
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("COMMENT post error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.file) {
      const filePath = path.resolve(__dirname, "..", post.file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully", postId: post._id });
  } catch (err) {
    console.error("DELETE post error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const userPosts = await Post.find({ user: username }).sort({ createdAt: -1 });
    res.json(userPosts);
  } catch (err) {
    console.error("GET user posts error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- NEW: GET short videos (<= 120s) ----------------
router.get("/shorts", async (req, res) => {
  try {
    const shorts = await Post.find({
      duration: { $lte: 120 },
      file: { $exists: true },
    }).sort({ createdAt: -1 });

    res.json(shorts);
  } catch (err) {
    console.error("GET shorts error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
