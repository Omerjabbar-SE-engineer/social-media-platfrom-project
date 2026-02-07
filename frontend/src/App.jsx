import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Shorts from "./pages/Shorts";
import Contact from "./pages/Contact"; // ✅ Import Contact
import About from "./pages/About";     // ✅ Import About

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />        
        <Route path="/register" element={<Register />} />  
        <Route path="/login" element={<Login />} />        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/contact" element={<Contact />} />  {/* Now works */}
        <Route path="/about" element={<About />} />      {/* Now works */}
      </Routes>
    </Router>
  );
}

export default App;
