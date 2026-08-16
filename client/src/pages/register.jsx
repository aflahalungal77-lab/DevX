import React from 'react';
import '../index.css';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
;
function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
  e.preventDefault();

  const response = await fetch(
    "http://localhost:5000/api/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    }
  );

  const data = await response.json();

  console.log(data);
  if(response.ok) {
    localStorage.setItem("token", data.token);
    navigate("/login");
  }
  
};
  return (
    <div className="login-page">

      <div className="login-container">
        <h1 className="heading">Create Account</h1>

        <p className="subHeading">
          Join DevX today
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}  
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Create Account
          </button>
        </form>
      </div>

      <p className="register-text">
        Already have an account?{' '}
        <Link to="/login">Login</Link>
      </p>

    </div>
  );
}

export default Register;