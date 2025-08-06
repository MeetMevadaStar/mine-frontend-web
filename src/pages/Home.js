import React, { useEffect, useState, useCallback } from "react";
import apiService from "../api/apiService";
import { ENDPOINTS } from "../constants/endpoints";
import "../styles/Home.css";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedGender, setSelectedGender] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  const applyFilters = useCallback((userList, gender, order) => {
    let filtered = [...userList];

    if (gender !== "all") {
      filtered = filtered.filter((user) => user.role_id === gender);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return order === "latest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredUsers(filtered);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiService.get(ENDPOINTS.GET_ALL_USERS, {
        requiresAuth: true,
      });
      const userList = res || [];
      setUsers(userList);
      applyFilters(userList, selectedGender, sortOrder);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, [applyFilters, selectedGender, sortOrder]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await apiService.delete(`${ENDPOINTS.DELETE_USER}/${id}`, {
        requiresAuth: true,
      });
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Error deleting user.");
    }
  };

  const handleGenderChange = (e) => {
    const gender = e.target.value;
    setSelectedGender(gender);
    applyFilters(users, gender, sortOrder);
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    applyFilters(users, selectedGender, order);
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // ✅ No warning now

  return (
    <div className="home-container">
      <h2 className="home-title">All Users</h2>

      {/* 🔽 Filters */}
      <div className="filter-container">
        <div>
          <label>Gender: </label>
          <select value={selectedGender} onChange={handleGenderChange}>
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Sort by Date: </label>
          <select value={sortOrder} onChange={handleSortChange}>
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* 🧾 User Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th> {/* ✅ New column */}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, i) => (
                <tr key={user.id || i}>
                  <td>{i + 1}</td>
                  <td>{`${user.first_name || ""} ${user.last_name || ""}`}</td>
                  <td>{user.email || "-"}</td>
                  <td>{user.mobile || "-"}</td>
                  <td className={user.role_id === "male" ? "male" : "female"}>
                    {user.role_id || "-"}
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 🕓 Format ISO date to readable format
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default Home;
