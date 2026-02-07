import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Profile.css";
import defaultUserImg from "../assets/user.png";

const Profile = ({ loggedInUserEmail }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAvatar, setNewAvatar] = useState(null);
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
    likes: 0,
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      // Fetch user profile
      const res = await axios.get(
        `http://localhost:5000/api/auth/user/${encodeURIComponent(loggedInUserEmail)}`
      );

      const userData = res.data || {};

      // Make sure followers & following arrays exist
      const followersArr = Array.isArray(userData.followers) ? userData.followers : [];
      const followingArr = Array.isArray(userData.following) ? userData.following : [];

      setProfile(userData);

      // Fetch user's posts
      const postsRes = await axios.get(
        `http://localhost:5000/api/posts/user/${encodeURIComponent(userData.fullname)}`
      );
      const posts = postsRes.data || [];

      // Compute stats
      setStats({
        posts: posts.length,
        followers: followersArr.length,
        following: followingArr.length,
        likes: posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0),
      });
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  if (loading)
    return (
      <div className="profile-page">
        <div className="profile-card loading">
          <div className="loader"></div>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="profile-page">
        <p style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
          Profile not found
        </p>
      </div>
    );

  return (
    <div className="profile-page full">
      <div className="profile-main-card">
        {/* PROFILE AVATAR */}
        <div className="profile-avatar-section">
          <img
            src={newAvatar || profile.avatar || defaultUserImg}
            alt="Profile"
            className="profile-img"
          />
          <label className="avatar-upload">
            Change Avatar
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>

        {/* USER BASIC INFO */}
        <div className="profile-basic-info">
          <h2 className="profile-name">{profile.fullname}</h2>
          <p className="profile-username">@{profile.email.split("@")[0]}</p>
          <p className="profile-email">
            <strong>Email:</strong> {profile.email}
          </p>
          <p className="profile-phone">
            <strong>Phone:</strong> {profile.phone || "Not provided"}
          </p>
          <p className="profile-joined">
            <strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* REAL STATS */}
        <div className="profile-extra-info">
          <div className="info-block">
            <h3>Posts</h3>
            <p>{stats.posts}</p>
          </div>
          <div className="info-block">
            <h3>Followers</h3>
            <p>{stats.followers}</p>
          </div>
          <div className="info-block">
            <h3>Following</h3>
            <p>{stats.following}</p>
          </div>
          <div className="info-block">
            <h3>Likes</h3>
            <p>{stats.likes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
