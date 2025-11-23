import React, { useState, useEffect } from "react";
import RecipeGrid from "../components/Recipe/RecipeGrid";
import RecipeDetailsModal from "../components/Recipe/RecipeDetailsModal";
import AIBox from "../components/Recipe/AIBox";
import api from "../services/api";
import "../styles/MealPage.css";

const DietRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showAIBox, setShowAIBox] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({ search: "" });

  const fetchRecipes = async () => {
    try {
      const res = await api.get("/diet");
      if (!res.data?.dailyMeals) {
        setRecipes([]);
        setFilteredRecipes([]);
        return;
      }

      const allMeals = res.data.dailyMeals.flatMap((d) =>
        d.meals.map((m) => ({
          id: `${d.day}-${m.mealType}`,
          day: d.day,
          ...m,
          protein: m.protein ?? Math.floor(Math.random() * 30) + 5,
          badges: m.badges ?? ["High Fiber", "Easy Digest"],
        }))
      );

      setRecipes(allMeals);
      setFilteredRecipes(allMeals);
    } catch (err) {
      setRecipes([]);
      setFilteredRecipes([]);
      if (err.response?.status !== 404) console.error(err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    const filtered = filters.search
      ? recipes.filter((r) =>
          r.recipe.toLowerCase().includes(filters.search.toLowerCase())
        )
      : recipes;
    setFilteredRecipes(filtered);
  }, [filters, recipes]);

  return (
    <div className="meal-page font-display bg-background-light dark:bg-background-dark text-[#181511] dark:text-white/90 min-h-screen relative">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-black tracking-tighter">Diet Recipes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Find nourishing and delicious recipes tailored to your health needs.
          </p>
        </header>

        <div className="relative mb-6">
          <div className="flex h-14 w-full items-center rounded-lg bg-white dark:bg-background-dark shadow-md dark:shadow-sm dark:ring-1 dark:ring-white/10">
            <span className="material-symbols-outlined pl-4 text-gray-400">search</span>
            <input
              className="search-input"
              placeholder="Search for recipes, ingredients..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
        </div>

        <RecipeGrid recipes={filteredRecipes} onSelect={setSelectedRecipe} />

        {selectedRecipe && (
          <RecipeDetailsModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </main>

      <button className="fab" onClick={() => setShowAIBox(true)}>
        <span className="material-symbols-outlined text-3xl">auto_awesome</span>
      </button>

      {showAIBox && (
        <AIBox
          onClose={() => setShowAIBox(false)}
          setRecipes={(aiRecipes) => setFilteredRecipes((prev) => [...aiRecipes, ...prev])}
        />
      )}
    </div>
  );
};

export default DietRecipesPage;
