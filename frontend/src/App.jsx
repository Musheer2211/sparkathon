import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Statistics from "./Statistics";

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

  const DropdownMenu = ({ item, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen((prev) => !prev);

    return (
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "inline-block", height: "20px" }}>
          <div
            onClick={toggleMenu}
            style={{
              cursor: "pointer",
              padding: "1px",
              backgroundColor: "#f2f2f2",
              border: "1px solid #ccc",
              textAlign: "center",
              userSelect: "none",
              display: "inline-block",
              fontSize: "10px",
            }}
          >
            {isOpen ? "▲" : "▼"}
          </div>
          <strong>{item}</strong> {" - " + data.ingredients[index].quantity + " - "}
          <a
            href={`https://www.walmart.com/search?q=${encodeURIComponent(item)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy on Walmart
          </a>
        </div>
        <div>
          {isOpen && (
            <div
              style={{
                border: "1px solid #ccc",
                backgroundColor: "white",
                padding: "10px",
                marginTop: "5px",
                width: "490px",
              }}
            >
              {data.ingredients[index].listings.map((listing, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #ccc",
                    backgroundColor: "white",
                    padding: "5px",
                    marginTop: "5px",
                    width: "150px",
                    display: "inline-block",
                    height: "150px",
                  }}
                >
                  <a href={listing.product_url} target="_blank" rel="noreferrer">
                    <img
                      src={listing.image_url}
                      alt="Image"
                      style={{ width: "130px", display: "block" }}
                    />
                    <strong>
                      {listing.currency_symbol} {listing.price}
                    </strong>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const MainPage = () => (
    <>
      <div className="header">
        🍽️ Dish to Recipe & Walmart Helper
        <Link
        className="statbutton"
          to="/statistics"
          style={{
            fontFamily:"serif",
            float: "right",
            fontSize: "20px",
            color: "white",
            textDecoration: "none",
            marginRight: "20px",
          }}
        >
          📊 Statistics
        </Link>
      </div>

      <div className="container">
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Enter dish name (e.g., Butter Chicken)"
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            className="input"
            required
          />
          <button type="submit" className="button">
            Get Recipe
          </button>
        </form>

        {loading && <p className="loading-text">Loading...</p>}

        {data && (
          <div className="card">
            <div className="section">
              <h2>Ingredients</h2>
              {data.ingredients.map((item, index) => (
                <div key={index}>
                  <DropdownMenu item={item.name} index={index} />
                </div>
              ))}
            </div>

            <div className="section">
              <h2>Recipe</h2>
              {data.recipe.split("\n").map((step, index) => (
                <div key={index}>{step}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Router>
  );
}

export default App;
