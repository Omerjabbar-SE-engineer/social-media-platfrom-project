import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../css/Shorts.css";
import PostCard from "./PostCard"; // Reuse PostCard
import logo from "../assets/logo.png";

const Shorts = ({ loggedInUserId, loggedInUserName }) => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);

  const refreshVideoActions = () => {
    // Dummy function for PostCard refresh
    setVideos([...videos]);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/posts")
      .then((res) => {
        const onlyVideos = res.data.filter(
          (post) => post.file && post.file.endsWith(".mp4")
        );
        const shortVideos = onlyVideos.filter(
          (post) => !post.duration || post.duration < 120
        );
        setVideos(shortVideos);
      })
      .catch((err) => console.log("Fetch videos error:", err));
  }, []);

  useEffect(() => {
    const options = { root: null, threshold: 0.75 };
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.play().catch(() => {});
        else entry.target.pause();
      });
    };
    const observer = new IntersectionObserver(callback, options);
    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos]);

  const toggleMute = (index) => {
    const video = videoRefs.current[index];
    if (video) video.muted = !video.muted;
  };

  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (video) video.paused ? video.play() : video.pause();
  };

  return (
    <div className="shorts-root">
      {/* Logo top-left */}
      <div className="shorts-logo">
        <img src={logo} alt="SocialSphere" />
      </div>

      <div className="shorts-container">
        {videos.map((video, index) => (
          <div key={video._id} className="short-card">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={`http://localhost:5000${video.file}`}
              loop
              autoPlay
              muted={false} // Sound enabled by default
              className="short-video"
              onClick={() => togglePlayPause(index)}
            />

            {/* Mute button */}
            <button
              className="mute-btn"
              onClick={() => toggleMute(index)}
            >
              🔊
            </button>

            {/* Overlay Post Actions */}
            <div className="short-overlay">
              <PostCard
                post={video}
                loggedInUserId={loggedInUserId}
                loggedInUserName={loggedInUserName}
                compact={true} // Compact for overlay
                refresh={refreshVideoActions} // Ensure buttons work
              />
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <p style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
            No videos available
          </p>
        )}
      </div>
    </div>
  );
};

export default Shorts;
