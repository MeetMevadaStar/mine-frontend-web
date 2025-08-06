import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Home from "./Home";
import AddPair from "./AddPair";
import AddUser from "./AddUser";
import GetPair from "./GetPair";
import "../styles/Dashboard.css"; // Create this for layout

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/add-pair" element={<AddPair />} />
          <Route path="/get-pair" element={<GetPair />} />
          <Route path="/add-user" element={<AddUser />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
