import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/MealPage.css";

const RecipeDetailsModal = ({ recipe, onClose }) => {
  const [healthInfo, setHealthInfo] = useState("");

  useEffect(() => {
    const fetchHealthInfo = async () => {
      try {
        const res = await api.post("/chat", {
          message: `Explain why ${recipe.recipe} is healthy and beneficial in short, doctor-like style.`,
        });
        setHealthInfo(res.data.reply);
      } catch (err) {
        console.error(err);
        setHealthInfo("Could not fetch health insights.");
      }
    };

    if (recipe) fetchHealthInfo();
  }, [recipe]);

  if (!recipe) return null;

  return (
    <div className="recipe-modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="recipe-modal-content bg-white dark:bg-background-dark rounded-lg shadow-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="recipe-modal-close absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-white"
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
        <p className="text-gray-600 mb-4">
          {recipe.calories} Calories
        </p>

        {recipe.ingredients?.length > 0 && (
          <>
            <h3 className="font-semibold mb-1">Ingredients:</h3>
            <ul className="list-disc ml-5 mb-4">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </>
        )}

        {recipe.steps?.length > 0 && (
          <>
            <h3 className="font-semibold mb-1">Steps:</h3>
            <ol className="list-decimal ml-5 mb-4">
              {recipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </>
        )}

        <h3 className="font-semibold mb-1">Health Insights:</h3>
        <p className="text-gray-700 mb-4">{healthInfo || "Loading..."}</p>

        {recipe.youtubeLink && (
          <p className="mt-2">
            Watch video:{" "}
            <a
              href={recipe.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              {recipe.youtubeLink}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailsModal;
