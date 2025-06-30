// Statistics.jsx
import React, { useEffect,useState } from "react";
import "./Statistics.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Statistics() {
  const [dishStats, setDishStats] = useState(null);
  const [ingredientStats, setIngredientStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDishStat() {
      await fetch('http://localhost:5000/api/dishstat')
      .then((res) => res.json())
      .then((result) => {
        setDishStats(result);
        setLoading(false);
      })
      .catch((err) =>{
        console.error('API error:', err);
        setLoading(false);
      })
    }
    fetchDishStat();
  },[])

  useEffect(() => {
    async function fetchIngredientStat (){
      await fetch('http://localhost:5000/api/ingredientstat')
      .then((res) => res.json())
      .then((result) => {
        setIngredientStats(result);
        setLoading(false);
        console.log(dishStats)
      })
      .catch((err) =>{
        console.error('API error:', err);
        setLoading(false);
      })
    }
    fetchIngredientStat();
  },[])

  

  
    const getPieData = (dataArray, labelKey, valueKey) => ({
    labels: dataArray.map((item) => item[labelKey]),
    datasets: [
      {
        label: "# of uses",
        data: dataArray.map((item) => item[valueKey]),
        backgroundColor: [
          "#3498db",
          "#e74c3c",
          "#2ecc71",
          "#f1c40f",
          "#9b59b6",
          "#1abc9c"
        ],
        borderWidth: 1,
      },
    ],
  });
  

  return (
    <div className="stats-container">
      <h1>📊 Statistics</h1>
      {loading && <p className="loading-text">Loading...</p>}
      <div className="section-with-chart">
        <div className="table-wrapper">
          
          <h2>Dishes Searched</h2>
          <table>
            <thead>
              <tr>
                <th>Dish</th>
                <th>Search Count</th>
              </tr>
            </thead>
            <tbody>
              {dishStats && dishStats.map((item, index) => (
                <tr key={index}>
                  <td>{item.dish}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="chart-wrapper">
          {dishStats && <Pie data={getPieData(dishStats, "dish", "quantity")} />}
        </div>
      </div>

      <div className="section-with-chart">
        <div className="table-wrapper">
          <h2>Ingredients Used</h2>
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Usage Count</th>
              </tr>
            </thead>
            <tbody>
              {ingredientStats && ingredientStats.map((item, index) => (
                <tr key={index}>
                  <td>{item.ingredient}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="chart-wrapper">
          {ingredientStats && <Pie data={getPieData(ingredientStats, "ingredient", "quantity")} />}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
