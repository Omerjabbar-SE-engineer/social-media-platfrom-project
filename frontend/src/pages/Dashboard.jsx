import React, { useState, useEffect } from "react";
import "../css/Dashboard.css";
import menuIcon from "../assets/menu.png";
import logo from "../assets/logo.png";
import userImg from "../assets/user.png";
import axios from "axios";
import Profile from "./Profile"; 
import PostCard from "./PostCard"; 
import { Link, useNavigate } from "react-router-dom";


// ---------------- PostCard for my posts ----------------
const DashboardPostCard = ({ post, isMyPost, onDelete }) => {
  const postTypeClass =
    isMyPost && post.file ? "media-post" : isMyPost ? "text-post" : "";

  return (
    <div className={`post ${isMyPost ? "my-post" : ""} ${postTypeClass}`}>
      <div className="post-header">
        <img src={userImg} alt="user" />
        <div>
          <h4>{post.user}</h4>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
        {isMyPost && (
          <button
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              color: "#ff4444",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => onDelete(post._id)}
          >
            🗑️
          </button>
        )}
      </div>

      {post.file && post.file.endsWith(".mp4") ? (
        <video controls className="post-video">
          <source src={`http://localhost:5000${post.file}`} />
        </video>
      ) : post.file ? (
        <img
          src={`http://localhost:5000${post.file}`}
          alt="uploaded"
          style={{ width: "100%", borderRadius: "12px", marginBottom: "10px" }}
        />
      ) : null}

      {post.description && <p className="post-text">{post.description}</p>}
    </div>
  );
};

// ---------------- Dashboard ----------------
const Dashboard = () => {
  const navigate = useNavigate(); // ✅ Added

  const [open, setOpen] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postType, setPostType] = useState(null);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activePage, setActivePage] = useState("feed");
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);

  // ✅ Get logged-in user from localStorage
  const loggedInUserData = JSON.parse(localStorage.getItem("user"));
  const loggedInUserEmail = loggedInUserData?.email || "";
  const loggedInUserName = loggedInUserData?.fullname || "";

  // ---------------- Fetch posts ----------------
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    // Simply redirect to login
    navigate("/login");
  };




  const handleUpload = async () => {
    if (!description && postType === "text") return alert("Add some text");
    if (!description && !file && postType === "media") return alert("Add text or file");

    const formData = new FormData();
    formData.append("user", loggedInUserName || "Anonymous");
    formData.append("userId", loggedInUserData?._id);
    formData.append("description", description);
    if (file) formData.append("file", file);

    // Add duration if video
    if (videoDuration > 0) {
      formData.append("duration", videoDuration);
    }

    try {
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDescription("");
      setFile(null);
      setPostType(null);
      setShowPostModal(false);
      setVideoPreview(null); // ✅ Reset video preview
      setVideoDuration(0);   // ✅ Reset duration
      fetchPosts();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post");
    }
  };

  const myPosts = posts.filter((post) => post.user === loggedInUserName);
  const feedPosts = posts.filter((post) => post.user !== loggedInUserName);

  return (
    <div className="dash-root">
      {/* MENU BUTTON */}
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        <img src={menuIcon} alt="menu" />
      </button>

      {/* SIDEBAR */}
      <aside className={`dash-sidebar ${open ? "show" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="logo" className="sidebar-logo" />
          <h3>Social Sphere</h3>
        </div>

        <ul className="sidebar-links">
          <li onClick={() => setActivePage("feed")}>🏠 Home</li>
          <li onClick={() => setActivePage("myPosts")}>📝 My Posts</li>
          <li onClick={() => setActivePage("profile")}>👤 My Profile</li>
         <li onClick={() => navigate("/shorts")}>🎬 Shorts</li>
         <li onClick={() => navigate("/contact")}>📞 Contact</li>
          <li onClick={() => navigate("/about")}>ℹ About</li>
        <li onClick={handleLogout} style={{cursor:"pointer"}}>🚪 Logout</li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dash-main">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className={`feed-title ${activePage === "myPosts" ? "my-post-title" : ""}`}>
            {activePage === "feed"
              ? "Your Feed"
              : activePage === "myPosts"
              ? "My Posts"
              : "My Profile"}
          </h2>
          <img src={logo} alt="logo" className="top-right-logo" />
        </div>

        {activePage === "profile" ? (
          <Profile loggedInUserEmail={loggedInUserEmail} />
        ) : (
          <div className="feed">
            {activePage === "feed" &&
              feedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  refresh={fetchPosts}
                  loggedInUserId={loggedInUserData?._id}
                  loggedInUserName={loggedInUserData?.fullname}
                />
              ))}
{activePage === "myPosts" &&
  myPosts.map((post) => (
    <PostCard
      key={post._id}
      post={post}
      isMyPost={true}
      loggedInUserId={loggedInUserData?._id}
      loggedInUserName={loggedInUserData?.fullname}
      refresh={fetchPosts}
      onDelete={handleDeletePost}
    />
))}


            {activePage === "feed" && feedPosts.length < 3 &&
              [1, 2, 3].map((n) => (
                <div
                  key={"placeholder-" + n}
                  className="post"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  <p>Explore more posts from your friends!</p>
                </div>
              ))}
          </div>
        )}

        {activePage !== "profile" && (
          <button
            className={`fab ${activePage === "myPosts" ? "my-post-fab" : ""}`}
            onClick={() => setShowPostModal(true)}
          >
            ＋
          </button>
        )}

        {showPostModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(5px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1002,
            }}
            onClick={() => {
              setShowPostModal(false);
              setPostType(null);
              setFile(null);
              setDescription("");
              setVideoPreview(null); // ✅ Reset
              setVideoDuration(0);   // ✅ Reset
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                padding: "30px",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                minWidth: "350px",
                maxWidth: "400px",
                alignItems: "center",
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {!postType && (
                <>
                  <h3 style={{ color: "white" }}>Create Post</h3>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={{
                        padding: "10px 12px",
                        borderRadius: "12px",
                        border: "none",
                        background: "linear-gradient(45deg, #6a11cb, #2575fc)",
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => setPostType("text")}
                    >
                      📝 Text Post
                    </button>
                    <button
                      style={{
                        padding: "10px 12px",
                        borderRadius: "12px",
                        border: "none",
                        background: "linear-gradient(45deg, #ff512f, #dd2476)",
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => setPostType("media")}
                    >
                      🎥 Video/Image Post
                    </button>
                  </div>
                </>
              )}

              {postType === "text" && (
                <>
                  <h3 style={{ color: "white" }}>Text Post</h3>
                  <textarea
                    placeholder="Write something about your post..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "12px",
                      border: "none",
                      resize: "none",
                    }}
                  />
                  <button
                    onClick={handleUpload}
                    style={{
                      padding: "12px 0",
                      width: "100%",
                      borderRadius: "12px",
                      border: "none",
                      background: "linear-gradient(45deg, #1fa2ff, #12d8fa)",
                      color: "white",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Upload
                  </button>
                </>
              )}

              {postType === "media" && (
                <>
                  <h3 style={{ color: "white" }}>Video/Image Post</h3>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (!selectedFile) return;

                      setFile(selectedFile);

                      if (selectedFile.type.startsWith("video/")) { // ✅ fix
                        setVideoPreview(URL.createObjectURL(selectedFile));
                      } else {
                        setVideoPreview(null);
                        setVideoDuration(0);
                      }
                    }}
                    style={{ width: "100%" }}
                  />

                  {videoPreview && (
                    <video
                      src={videoPreview}
                      style={{ display: "none" }}
                      onLoadedMetadata={(e) => {
                        const seconds = Math.floor(e.target.duration);
                        setVideoDuration(seconds);
                        console.log("VIDEO DURATION:", seconds, "seconds");
                      }}
                    />
                  )}

                  <textarea
                    placeholder="Write something about your post..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "12px",
                      border: "none",
                      resize: "none",
                    }}
                  />
                  <button
                    onClick={handleUpload}
                    style={{
                      padding: "12px 0",
                      width: "100%",
                      borderRadius: "12px",
                      border: "none",
                      background: "linear-gradient(45deg, #1fa2ff, #12d8fa)",
                      color: "white",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Upload
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
