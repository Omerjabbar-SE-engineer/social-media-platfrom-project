const mongoose = require("mongoose");   // <-- THIS WAS MISSING

const PostSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
    file: { type: String },
    likes: { type: [String], default: [] },
    comments: {
      type: [
        {
          user: { type: String },
          text: { type: String },
          createdAt: { type: Date, default: Date.now },
          profilePic: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
