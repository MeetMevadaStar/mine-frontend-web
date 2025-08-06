// src/components/Sidebar.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/"); // redirect to login page
  };

  return (
    <div className="sidebar">
      <h2 className="logo">Admin</h2>
      <ul className="nav-links">
        <li>
          <NavLink to="/home" activeclassname="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/get-pair" activeclassname="active">
            Get Pair
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-pair" activeclassname="active">
            Add Pair
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-user" activeclassname="active">
            Add User
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
