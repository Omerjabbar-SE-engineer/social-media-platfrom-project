import React, { useEffect, useState } from "react";
import "../css/AuthPages.css";
import logo from "../assets/logo.png";
import sampleLogin from "../assets/sample-login.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const loginFeatures = [
  { title: "Connect Instantly", desc: "See what your friends are sharing in real-time." },
  { title: "Engage", desc: "Like, comment, and share posts easily." },
  { title: "Stay Updated", desc: "Follow users and get updates instantly." },
  { title: "Dark Mode", desc: "Enjoy smooth, eye-friendly dark mode." },
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const cards = document.querySelectorAll(".auth-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((card) => observer.observe(card));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // ✅ Store user object in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="auth-page new-style">
      <div className="auth-left">
        <img src={logo} alt="Logo" className="main-logo" />
        <h1>Welcome Back to Social Sphere</h1>
        <p>Login to explore your social network and connect with friends.</p>

        <div className="auth-card form-card">
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card image-card">
          <img src={sampleLogin} alt="Sample Login" className="sample-img" />
        </div>

        {loginFeatures.map((f, i) => (
          <div className="auth-card feature-card" key={i}>
            <img src={logo} alt="Logo" className="card-logo" />
            <div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;
