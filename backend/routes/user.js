const router = require("express").Router();
const User = require("../models/User");

/* FOLLOW USER */
router.post("/follow", async (req, res) => {
  try {
    const { userId, followId } = req.body;

    if (!userId || !followId) {
      return res.status(400).json({ msg: "userId and followId required" });
    }

    if (userId === followId) {
      return res.status(400).json({ msg: "Cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const target = await User.findById(followId);

    if (!user || !target) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.following.includes(followId)) {
      return res.status(400).json({ msg: "Already following" });
    }

    user.following.push(followId);
    target.followers.push(userId);

    await user.save();
    await target.save();

    res.json({ msg: "Followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
