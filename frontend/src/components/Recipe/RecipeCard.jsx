import React from "react";
import "../../styles/MealPage.css";

const badgeColors = {
  "High Fiber": "badge-green",
  "Easy Digest": "badge-blue",
  "Omega-3 Rich": "badge-orange",
  "Anti-Inflammatory": "badge-yellow",
  "Antioxidants": "badge-purple",
};

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div className="meal-card cursor-pointer" onClick={onClick}>
      <img
        src={recipe.image || "https://via.placeholder.com/300x200"}
        alt={recipe.recipe}
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{recipe.recipe}</h3>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>🔥 {recipe.calories} kcal</span>
          <span>💪 {recipe.protein}g Protein</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {recipe.badges?.map((b, i) => (
            <span key={i} className={`badge ${badgeColors[b] || "badge-green"}`}>
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Floating numbers like HTML example */}
      <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 backdrop-blur-sm">
        <span className="font-bold text-green-700 dark:text-green-300">
          {Math.floor(Math.random() * 100)}
        </span>
      </div>

      <div className="absolute top-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/50 backdrop-blur-sm">
        <span className="material-symbols-outlined text-2xl">add</span>
      </div>
    </div>
  );
};

export default RecipeCard;
