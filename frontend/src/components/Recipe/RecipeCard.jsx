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
  const [imgError, setImgError] = React.useState(false);
  const [imgLoading, setImgLoading] = React.useState(true);

  return (
    <div className="meal-card cursor-pointer" onClick={onClick}>
      <div className="relative">
        {imgLoading && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-400">Loading image...</span>
          </div>
        )}
        <img
          src={imgError ? "https://placehold.co/300x200?text=Recipe+Image" : (recipe.image || "https://placehold.co/300x200")}
          alt={recipe.recipe}
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgError(true);
            setImgLoading(false);
          }}
          className={imgLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}
        />
      </div>
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

      

      <div className="absolute top-3 right-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/50 backdrop-blur-sm">
        <span className="material-symbols-outlined text-2xl">add</span>
      </div>
    </div>
  );
};

export default RecipeCard;
