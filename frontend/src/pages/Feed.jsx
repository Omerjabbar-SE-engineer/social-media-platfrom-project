import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import "../css/Feed.css";
import logo from "../assets/logo.png"; // <-- import your logo

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load feed", err);
    }
  };

  return (
    <div className="feed-page">
      <h2 className="feed-title">
        <img src={logo} alt="Logo" />
        Community Feed
      </h2>

      {posts.length === 0 && <p style={{ color: "gray" }}>No posts yet</p>}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} refresh={fetchPosts} />
      ))}
    </div>
  );
};

export default Feed;
