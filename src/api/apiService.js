// src/api/apiService.js
import axios from "axios";
import { BASE_URL } from "../constants/endpoints";

const getToken = () => localStorage.getItem("authToken");

const request = async (method, url, options = {}) => {
  const { data = null, requiresAuth = false, headers = {} } = options;

  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  console.log("requiresAuth", requiresAuth);

  if (requiresAuth) {
    const token = getToken();

    console.log("token", token);

    if (!token) {
      localStorage.removeItem("authToken"); // Clear invalid/missing token
      window.location.href = "/";
      throw new Error("No token provided");
    }

    config.headers["Authorization"] = `${token}`;
  }

  if (data) {
    config.data = data;
  }

  // 📦 Log full request config
  console.log("📤 [API Request]", {
    method: config.method,
    url: config.url,
    headers: config.headers,
    data: config.data || null,
  });

  try {
    const response = await axios(config);

    // ✅ Log full successful response
    console.log("✅ [API Response]", {
      url: config.url,
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error) {
    // ❌ Log full error
    console.error("❌ [API Error]", {
      url: config.url,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // 🔐 Redirect to login if 401
    if (error.response?.status === 401 || error.response?.status === 401) {
      localStorage.removeItem("authToken"); // Clear token
      window.location.href = "/login"; // Redirect to login page
    }

    throw error;
  }
};

const apiService = {
  get: (url, options) => request("GET", url, options),
  post: (url, options) => request("POST", url, options),
  put: (url, options) => request("PUT", url, options),
  delete: (url, options) => request("DELETE", url, options),
};

export default apiService;
