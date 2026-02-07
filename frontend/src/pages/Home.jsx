import React, { useEffect } from "react";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import demoImg from "../assets/demo.png";

const demoFeatures = [
  { title: "Create Posts", description: "Share your thoughts instantly." },
  { title: "Comment on Posts", description: "Engage with others easily." },
  { title: "Like Posts", description: "Show appreciation for content." },
  { title: "Follow Users", description: "Stay updated with friends." },
  { title: "Profile Customization", description: "Personalize your profile." },
  { title: "Dark Mode", description: "Switch to a sleek dark theme." },
  { title: "Notifications", description: "Never miss any activity." },
  { title: "Search Users", description: "Find friends and content fast." },
  { title: "Private Messaging", description: "Chat privately with friends." },
  { title: "Media Upload", description: "Share images and videos." },
];

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const cards = document.querySelectorAll(".feature-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("fade-in");
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((card) => observer.observe(card));
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Left Glass Card */}
        <div className="hero-left-card">
          <h1>Welcome to Social Sphere</h1>
          <p>Connect, share, and explore amazing features!</p>
          <div className="button-card">
            <button
              className="btn register-btn"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
            <button
              className="btn login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>

        {/* Right Logo Blob */}
        <div className="hero-right-blob">
          <img src={demoImg} alt="Logo" className="logo-image" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        {demoFeatures.map((feature, index) => (
          <div
            className={`feature-card full-width-card gradient-card-${index % 5}`}
            key={index}
          >
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
