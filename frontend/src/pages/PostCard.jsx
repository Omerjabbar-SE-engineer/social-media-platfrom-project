import React, { useState } from "react";
import ReactDOM from "react-dom"; // <-- import portal
import axios from "axios";
import "../css/PostCard.css";

// Social icons
import whatsappIcon from "../assets/whatsapp.png";
import twitterIcon from "../assets/twitter.png";
import linkedinIcon from "../assets/linkedin.png";
import facebookIcon from "../assets/facebook.png";
import xIcon from "../assets/x.png";
import defaultUser from "../assets/user.png";

const PostCard = ({ post, refresh, loggedInUserId, loggedInUserName, compact = false }) => {
  const loggedInUser = {
    _id: loggedInUserId,
    fullname: loggedInUserName,
  };

  const [comment, setComment] = useState("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);

  // Like post
  const likePost = async () => {
    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 500);
    try {
      await axios.post(`http://localhost:5000/api/posts/${post._id}/like`, {
        user: loggedInUser.fullname || "Anonymous",
      });
      refresh();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // Add comment
  const addComment = async () => {
    if (!comment) return;
    try {
      await axios.post(`http://localhost:5000/api/posts/${post._id}/comment`, {
        user: loggedInUser.fullname || "Anonymous",
        text: comment,
      });
      setComment("");
      refresh();
      setShowCommentsModal(false);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };


const deletePost = async (postId) => {
  if (!window.confirm("Are you sure you want to delete this post?")) return;
  try {
    await axios.delete(`http://localhost:5000/api/posts/${postId}`);
    refresh(); // refresh the post list after deletion
  } catch (err) {
    console.error("Delete post error:", err);
    alert(err.response?.data?.msg || "Failed to delete post");
  }
};




  // Follow post owner
  const handleFollow = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/follow", {
        userId: loggedInUser._id,
        followId: post.userId,
      });
      alert("Followed successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Follow error");
    }
  };

  // Share post
  const sharePost = (platform) => {
    const postUrl = encodeURIComponent(`http://localhost:3000/posts/${post._id}`);
    const text = encodeURIComponent(`Check out this post by ${post.user}!`);
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${postUrl}&text=${text}`;
        break;
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${text}%20${postUrl}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`;
        break;
      case "x":
        url = `https://x.com/intent/tweet?url=${postUrl}&text=${text}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
        break;
      default:
        return;
    }

    window.open(url, "_blank", "width=600,height=400");
  };

  const timeAgo = (date) => {
    if (!date) return "just now";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className={`post-card ${compact ? "compact" : ""}`}>
      <h4>{post.user}</h4>
      <p className="post-text">{post.description}</p>
      {post.file && post.file.endsWith(".mp4") ? (
        <video
          controls
          className="post-video"
          style={{ width: "100%", borderRadius: "12px", marginBottom: "10px" }}
        >
          <source src={`http://localhost:5000${post.file}`} type="video/mp4" />
        </video>
      ) : post.file ? (
        <img
          src={`http://localhost:5000${post.file}`}
          alt="post"
          style={{ width: "100%", borderRadius: "12px", marginBottom: "10px" }}
        />
      ) : null}

      <div className="post-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button onClick={likePost} className={`heart-btn ${animateLike ? "like-animate" : ""}`}>
          ❤️ {post.likes.length}
        </button>
        <button onClick={() => setShowCommentsModal(true)} className="action-btn">
          💬 {post.comments.length}
        </button>
        {loggedInUser._id !== post.userId && (
          <button onClick={handleFollow} className="action-btn">
            ➕ Follow
          </button>
        )}
        <button onClick={() => setShowShareModal(true)} className="action-btn">
          🔁 Share
        </button>


 {/* DELETE BUTTON FOR OWN POSTS */}
  {loggedInUser._id === post.userId && (
    <button onClick={() => deletePost(post._id)} className="action-btn delete-btn">
      🗑️ Delete
    </button>
  )}



      </div>

      {/* ---------- Share Modal ---------- */}
      {showShareModal &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Share Post With</h3>
              <div className="share-icons">
                <button onClick={() => sharePost("whatsapp")}>
                  <img src={whatsappIcon} alt="WhatsApp" />
                </button>
                <button onClick={() => sharePost("twitter")}>
                  <img src={twitterIcon} alt="Twitter" />
                </button>
                <button onClick={() => sharePost("linkedin")}>
                  <img src={linkedinIcon} alt="LinkedIn" />
                </button>
                <button onClick={() => sharePost("facebook")}>
                  <img src={facebookIcon} alt="Facebook" />
                </button>
                <button onClick={() => sharePost("x")}>
                  <img src={xIcon} alt="X" />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}





      {/* ---------- Comment Modal ---------- */}
      {showCommentsModal &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={() => setShowCommentsModal(false)}>
            <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Comments</h3>
              <div className="comment-list">
                {post.comments.map((c, i) => (
                  <div className="comment-card" key={i}>
                    <img src={c.profilePic || defaultUser} alt={c.user} className="comment-avatar" />
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-user">{c.user}</span>
                        <span className="comment-time">• {timeAgo(c.createdAt)}</span>
                      </div>
                      <div className="comment-text">{c.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <button className="post-comment-btn" onClick={addComment}>
                Post
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default PostCard;
