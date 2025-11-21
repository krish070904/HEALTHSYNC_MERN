import React from "react";
import RecipeCard from "./RecipeCard";
import "../../styles/MealPage.css";

const RecipeGrid = ({ recipes, onSelect }) => {
  if (!recipes.length)
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">restaurant</span>
        <p className="text-gray-500 dark:text-gray-400 text-lg">No recipes found.</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Try generating a diet plan or use the AI button to create custom recipes!
        </p>
      </div>
    );

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} onClick={() => onSelect(r)} />
      ))}
    </div>
  );
};

export default RecipeGrid;
