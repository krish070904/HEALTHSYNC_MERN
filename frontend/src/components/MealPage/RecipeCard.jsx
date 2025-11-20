import React from "react";

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <div
      className="bg-white rounded shadow hover:shadow-lg cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <img
        src={recipe.image || "https://via.placeholder.com/300x200"}
        alt={recipe.recipe}
        className="w-full h-40 object-cover"
      />
      <div className="p-3">
        <h2 className="font-bold text-lg">{recipe.recipe}</h2>
        <p className="text-sm text-gray-500">{recipe.mealType}</p>
        <p className="text-sm mt-1">{recipe.calories} Calories</p>
      </div>
    </div>
  );
};

export default RecipeCard;
