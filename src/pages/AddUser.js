import { useState } from "react";
import "../styles/AddUser.css";
import apiService from "../api/apiService";
import { ENDPOINTS } from "../constants/endpoints";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    gender: "male", // dropdown value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Mobile validation (10-digit number)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      role_id: formData.gender.toLowerCase(), // Maps gender to role_id
    };

    try {
      const res = await apiService.post(ENDPOINTS.ADD_USERS, {
        requiresAuth: true,
        data: payload,
      });
      console.log("✅ Registration successful:", res.msg);
      alert("User registered successfully!");

      // ✅ Clear form fields after successful registration
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        password: "",
        gender: "male", // reset to default
      });
    } catch (error) {
      console.error("❌ Registration failed:", error);
      alert("Registration failed!");
    }
  };

  return (
    <div className="register-container">
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
