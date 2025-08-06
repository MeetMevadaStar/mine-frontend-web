// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../api/apiService";
import { ENDPOINTS } from "../constants/endpoints";
import "../styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("meetstarboy");
  const [password, setPassword] = useState("Admin@123");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await apiService.post(ENDPOINTS.ADMIN_LOGIN, {
        data: { username, password }, // ✅ wrap credentials inside `data`
        requiresAuth: false, // ✅ no auth required for login
      });

      const token = res?.token;
      if (token) {
        localStorage.setItem("authToken", token);
        navigate("/home");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
