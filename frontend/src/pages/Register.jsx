import React, { useEffect, useState } from "react";
import "../css/AuthPages.css";
import logo from "../assets/logo.png";
import sampleRegister from "../assets/sample-register.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const registerFeatures = [
  { title: "Create Your Profile", desc: "Show your friends who you are." },
  { title: "Share Posts", desc: "Post updates, images, and thoughts." },
  { title: "Follow People", desc: "Grow your social circle easily." },
  { title: "Customize", desc: "Personalize your profile and feed." },
];

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

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

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        fullname,
        email,
        phone,
        password,
      });

      alert("Registered successfully!");

      // ✅ Store registered user in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data.msg) {
        alert(err.response.data.msg);
      } else {
        alert("Something went wrong!");
      }
    }
  };

  return (
    <div className="auth-page new-style">
      <div className="auth-left">
        <img src={logo} alt="Logo" className="main-logo" />
        <h1>Create Your Account</h1>
        <p>Join Social Sphere to start sharing and connecting instantly.</p>

        <div className="auth-card form-card">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleRegister}>Create Account</button>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card image-card">
          <img src={sampleRegister} alt="Sample Register" className="sample-img" />
        </div>

        {registerFeatures.map((f, i) => (
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

export default Register;
