import React, { useEffect, useState, useCallback } from "react";
import apiService from "../api/apiService";
import { ENDPOINTS } from "../constants/endpoints";
import "../styles/Home.css"; // Reusing styles from Home

const GetPair = () => {
  const [pairs, setPairs] = useState([]);

  const fetchPairs = useCallback(async () => {
    try {
      const res = await apiService.get(ENDPOINTS.GET_ALL_PAIRS, {
        requiresAuth: true,
      });
      setPairs(res || []);
    } catch (err) {
      console.error("Failed to fetch pairs", err);
    }
  }, []);

  const handleDeletePair = async (pairId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pair?"
    );
    if (!confirmDelete) return;

    try {
      await apiService.delete(`${ENDPOINTS.DELETE_PAIR}/${pairId}`, {
        requiresAuth: true,
      });
      fetchPairs(); // Refresh list
    } catch (err) {
      console.error("Failed to delete pair", err);
      alert("Error deleting pair.");
    }
  };

  useEffect(() => {
    fetchPairs();
  }, [fetchPairs]);

  return (
    <div className="home-container">
      <h2 className="home-title">All Pairs</h2>

      <div style={{ overflowX: "auto" }}>
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User 1</th>
              <th>User 2</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pairs.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No pairs found
                </td>
              </tr>
            ) : (
              pairs.map((pair, i) => (
                <tr key={pair.pair_id || i}>
                  <td>{i + 1}</td>
                  <td>{pair.user1_name || "-"}</td>
                  <td>{pair.user2_name || "-"}</td>
                  <td>{formatDate(pair.pair_created_time)}</td>
                  <td>
                    <button
                      onClick={() => handleDeletePair(pair.pair_id)}
                      className="delete-btn"
                    >
                      Delete Pair
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

export default GetPair;
