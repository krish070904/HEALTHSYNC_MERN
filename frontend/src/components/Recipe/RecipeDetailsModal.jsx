import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/MealPage.css";

const RecipeDetailsModal = ({ recipe, onClose }) => {
  const [healthInfo, setHealthInfo] = useState("");

  useEffect(() => {
    const fetchHealthInfo = async () => {
      try {
        const res = await api.post("/chat", {
          message: `Explain why ${recipe.recipe} is beneficial for a person with ${recipe.disease || "general"} in short, doctor-like style.`,
        });
        setHealthInfo(res.data.reply);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHealthInfo();
  }, [recipe]);

  return (
    <div className="recipe-modal">
      <div className="recipe-modal-content">
        <button className="recipe-modal-close" onClick={onClose}>
          ✕
        </button>
        <img
          src={recipe.image || "https://via.placeholder.com/600x400"}
          alt={recipe.recipe}
        />
        <h2 className="text-2xl font-bold mb-2">{recipe.recipe}</h2>
        <p className="text-gray-600 mb-4">
          {recipe.mealType} - {recipe.calories} Calories
        </p>

        <h3 className="font-semibold mb-1">Ingredients:</h3>
        <ul className="list-disc ml-5 mb-4">
          {recipe.ingredients?.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>

        <h3 className="font-semibold mb-1">Steps:</h3>
        <ol className="list-decimal ml-5 mb-4">
          {recipe.steps?.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        <h3 className="font-semibold mb-1">Health Insights:</h3>
        <p className="text-gray-700">{healthInfo || "Loading..."}</p>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;
