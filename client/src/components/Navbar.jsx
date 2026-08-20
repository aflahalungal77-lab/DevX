import React from "react";
import "../index.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};
  return (
    <nav className="navbar">
      <h2>DVexo</h2>

      <div className="nav-links">
        <NavLink to="/feed">Feed</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;