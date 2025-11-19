import React from "react";
import { useNavigate } from "react-router-dom";

const DietCard = ({ diet }) => {
  const meals = diet?.meals || [];
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/2 lg:w-1/3">
      <h2 className="text-lg font-semibold mb-2">Today's Meals</h2>

      {meals.length > 0 ? (
        <ul className="space-y-1 max-h-40 overflow-y-auto">
          {meals.map((meal, idx) => (
            <li key={idx} className="p-2 border-b border-gray-200 truncate">
              <span className="font-medium">{meal.time}:</span> {meal.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No meals scheduled for today.</p>
      )}

      <button
        onClick={() => navigate("/diet")}
        className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        View Weekly Plan
      </button>
    </div>
  );
};


export default DietCard;
