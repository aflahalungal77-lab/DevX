import React from 'react';
import '../index.css';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
  e.preventDefault();

  const response = await fetch(
    "https://devx-api-4fki.onrender.com/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await response.json();

  console.log(data);
  if (response.ok) {
  localStorage.setItem("token", data.token);
  navigate("/profile");
}
};
  return (
    <div className="login-page">

      <div className="login-container">
        <h1 className="heading">DevX</h1>

        <p className="subHeading">
          Welcome back to DevX
        </p>

        <form  onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
            required
            value={password}
onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>

      <p className="register-text">
        Don't have an account? <Link to="/register">Register</Link>
      </p>

    </div>
  );
}

export default Login;