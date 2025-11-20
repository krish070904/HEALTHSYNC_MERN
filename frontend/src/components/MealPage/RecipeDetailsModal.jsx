import React, { useEffect, useState } from "react";
import api from "../../services/api"; // use api.js

const RecipeDetailsModal = ({ recipe, onClose }) => {
  const [healthInfo, setHealthInfo] = useState("");

  useEffect(() => {
    const fetchHealthInfo = async () => {
      try {
        const res = await api.post("/chat", {
          message: `Explain why ${recipe.recipe} is beneficial for a person with diabetes in short, doctor-like style.`,
        });
        setHealthInfo(res.data.reply);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHealthInfo();
  }, [recipe]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        <img
          src={recipe.image || "https://via.placeholder.com/600x400"}
          alt={recipe.recipe}
          className="w-full h-60 object-cover rounded mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{recipe.recipe}</h2>
        <p className="text-gray-600 mb-4">{recipe.mealType} - {recipe.calories} Calories</p>
        
        <h3 className="font-semibold mb-1">Ingredients:</h3>
        <ul className="list-disc ml-5 mb-4">
          {recipe.ingredients?.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>

        <h3 className="font-semibold mb-1">Steps:</h3>
        <ol className="list-decimal ml-5 mb-4">
          {recipe.steps?.map((step, i) => <li key={i}>{step}</li>)}
        </ol>

        <h3 className="font-semibold mb-1">Health Insights:</h3>
        <p className="text-gray-700">{healthInfo || "Loading..."}</p>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;
