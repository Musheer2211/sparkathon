import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Statistics from "./Statistics";
import MainPage from "./MainPage";

function App() {
  const [dish, setDish] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setData(null);
    
    try {
      const response = await fetch("http://localhost:5000/api/recipe_listings/" + encodeURIComponent(dish));
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
      alert("Error fetching recipe.");
    }

    setLoading(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              dish={dish}
              setDish={setDish}
              handleSubmit={handleSubmit}
              data={data}
              loading={loading}
            />
          }
        />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Router>
  );
}

export default App;
