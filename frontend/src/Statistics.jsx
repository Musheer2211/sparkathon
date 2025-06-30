// Statistics.jsx
import React from "react";
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
  const dishStats = [
    { dish: "Butter Chicken", count: 12 },
    { dish: "Pasta Alfredo", count: 9 },
    { dish: "Biryani", count: 7 },
  ];

  const ingredientStats = [
    { ingredient: "Chicken", count: 18 },
    { ingredient: "Salt", count: 15 },
    { ingredient: "Pasta", count: 13 },
  ];

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
              {dishStats.map((item, index) => (
                <tr key={index}>
                  <td>{item.dish}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="chart-wrapper">
          <Pie data={getPieData(dishStats, "dish", "count")} />
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
              {ingredientStats.map((item, index) => (
                <tr key={index}>
                  <td>{item.ingredient}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="chart-wrapper">
          <Pie data={getPieData(ingredientStats, "ingredient", "count")} />
        </div>
      </div>
    </div>
  );
}

export default Statistics;
