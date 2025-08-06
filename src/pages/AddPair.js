import { useEffect, useState } from "react";
import apiService from "../api/apiService";
import { ENDPOINTS } from "../constants/endpoints";
import "../styles/AddPair.css"; // 👈 Make sure this path matches your project structure

const AddPair = () => {
  const [males, setMales] = useState([]);
  const [females, setFemales] = useState([]);
  const [selectedMale, setSelectedMale] = useState(null);
  const [selectedFemale, setSelectedFemale] = useState(null);

  const fetchUnpairedUsers = async () => {
    try {
      const res = await apiService.get(ENDPOINTS.GET_ALL_USERS, {
        requiresAuth: true,
      });

      const unpaired = res.filter((user) => user.pair_id === null);

      setMales(unpaired?.filter((u) => u.role_id === "male"));
      setFemales(unpaired?.filter((u) => u.role_id === "female"));
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchUnpairedUsers();
  }, []);

  const handleMakePair = async () => {
    if (!selectedMale || !selectedFemale) {
      alert("Please select one male and one female");
      return;
    }

    try {
      const res = await apiService.post(ENDPOINTS.CREATE_PAIR, {
        requiresAuth: true,
        data: {
          user1_id: selectedMale,
          user2_id: selectedFemale,
        },
      });

      alert(res.msg);
      setSelectedMale(null);
      setSelectedFemale(null);
      fetchUnpairedUsers();
    } catch (err) {
      alert(
        "❌ Error creating pair: " + (err.response?.data?.msg || err.message)
      );
    }
  };

  return (
    <div className="pair-container">
      <div className="user-list">
        <h2>👦 Unpaired Males</h2>
        {males.map((male) => (
          <label key={male.id} className="user-item">
            <input
              type="radio"
              name="male"
              value={male.id}
              checked={selectedMale === male.id}
              onChange={() => setSelectedMale(male.id)}
            />
            {male.first_name} {male.last_name}
          </label>
        ))}
      </div>

      <div className="user-list">
        <h2>👧 Unpaired Females</h2>
        {females.map((female) => (
          <label key={female.id} className="user-item">
            <input
              type="radio"
              name="female"
              value={female.id}
              checked={selectedFemale === female.id}
              onChange={() => setSelectedFemale(female.id)}
            />
            {female.first_name} {female.last_name}
          </label>
        ))}
      </div>

      <div className="action-container">
        <button className="pair-button" onClick={handleMakePair}>
          💞 Make Pair
        </button>
      </div>
    </div>
  );
};

export default AddPair;
