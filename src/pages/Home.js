import React, { useEffect, useState, useCallback } from "react";
import apiService from "../api/apiService";
import { ENDPOINTS } from "../constants/endpoints";
import "../styles/Home.css";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedGender, setSelectedGender] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [editUserData, setEditUserData] = useState(null);

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
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiService.delete(`${ENDPOINTS.DELETE_USER}/${id}`, {
        requiresAuth: true,
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);

      const errorMsg =
        err.response?.data?.msg || err.message || "Something went wrong";

      alert(errorMsg);
    }
  };

  const handleEdit = (user) => {
    setEditUserData({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      mobile: user.mobile,
      password: "",
    });
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
  }, [fetchUsers]);

  return (
    <div className="home-container">
      <h2 className="home-title">All Users</h2>

      {/* Filters */}
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

      {/* User Table */}
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
              <th>Actions</th>
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
                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
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

      {editUserData && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target.className === "modal-overlay") {
              setEditUserData(null);
            }
          }}
        >
          <div className="modal">
            <h3>Edit User</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await apiService.put(
                    `${ENDPOINTS.EDIT_USER}/${editUserData.id}`,
                    {
                      requiresAuth: true,
                      data: {
                        first_name: editUserData.first_name,
                        last_name: editUserData.last_name,
                        email: editUserData.email,
                        mobile: editUserData.mobile,
                        password: editUserData.password || undefined,
                        role_id: editUserData.role_id, // 👈 send updated gender
                      },
                    }
                  );
                  alert("User updated successfully!");
                  setEditUserData(null);
                  fetchUsers();
                } catch (err) {
                  console.error("Failed to update user", err);
                  alert("Error updating user.");
                }
              }}
            >
              <input
                type="text"
                value={editUserData.first_name}
                onChange={(e) =>
                  setEditUserData({
                    ...editUserData,
                    first_name: e.target.value,
                  })
                }
                placeholder="First Name"
                required
              />
              <input
                type="text"
                value={editUserData.last_name}
                onChange={(e) =>
                  setEditUserData({
                    ...editUserData,
                    last_name: e.target.value,
                  })
                }
                placeholder="Last Name"
                required
              />
              <input
                type="email"
                value={editUserData.email}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, email: e.target.value })
                }
                placeholder="Email"
                required
              />
              <input
                type="text"
                value={editUserData.mobile}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, mobile: e.target.value })
                }
                placeholder="Mobile"
                required
              />

              {/* 👇 New Gender Dropdown */}
              <select
                value={editUserData.role_id || "male"}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, role_id: e.target.value })
                }
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <input
                type="password"
                value={editUserData.password}
                onChange={(e) =>
                  setEditUserData({ ...editUserData, password: e.target.value })
                }
                placeholder="New Password (leave blank to keep current)"
              />

              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditUserData(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

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
