import React from "react";
import RecipeCard from "./RecipeCard";

const RecipeGrid = ({ recipes, onSelect }) => {
  if (!recipes.length)
    return <p className="text-gray-500">No recipes found for selected filters.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {recipes.map(r => (
        <RecipeCard key={r.id} recipe={r} onClick={() => onSelect(r)} />
      ))}
    </div>
  );
};

export default RecipeGrid;
