const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ---------------- Routes ----------------
const userRoutes = require("./routes/user");      // existing user routes
const postRoutes = require("./routes/posts");     // existing post routes
const authRoutes = require("./routes/auth");      // <-- add this for login/register

const app = express();

// ---------------- Middleware ----------------
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ---------------- API Routes ----------------
app.use("/api/users", userRoutes);   // existing
app.use("/api/posts", postRoutes);   // existing
app.use("/api/auth", authRoutes);    // <-- new auth route

// ---------------- Connect to MongoDB ----------------
mongoose
  .connect("mongodb://127.0.0.1:27017/social-app") // adjust DB name if needed
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ---------------- Start server ----------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
