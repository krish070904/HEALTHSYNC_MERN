import React, { useEffect, useState } from "react";
import RecipeFilters from "../components/Recipe/RecipeFilters";
import RecipeGrid from "../components/Recipe/RecipeGrid";
import RecipeDetailsModal from "../components/Recipe/RecipeDetailsModal";
import api from "../services/api";
import "../styles/MealPage.css";

const DietRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [filters, setFilters] = useState({ disease: "", mealType: "All", search: "" });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchRecipes = async () => {
    try {
      const res = await api.get("/diet");
      const allMeals = res.data.dailyMeals.flatMap((d) =>
        d.meals.map((m) => ({
          id: `${d.day}-${m.mealType}`,
          day: d.day,
          ...m,
          protein: m.protein || Math.floor(Math.random() * 30) + 5,
          badges: m.badges || ["High Fiber", "Easy Digest"],
        }))
      );
      setRecipes(allMeals);
      setFilteredRecipes(allMeals);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    let filtered = [...recipes];
    if (filters.search)
      filtered = filtered.filter((r) =>
        r.recipe.toLowerCase().includes(filters.search.toLowerCase())
      );
    if (filters.mealType && filters.mealType !== "All")
      filtered = filtered.filter(
        (r) => r.mealType.toLowerCase() === filters.mealType.toLowerCase()
      );
    setFilteredRecipes(filtered);
  }, [filters, recipes]);

  return (
    <div className="meal-page font-display bg-background-light dark:bg-background-dark text-[#181511] dark:text-white/90 min-h-screen relative">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-4xl font-black tracking-tighter">Diet Recipes</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Find nourishing and delicious recipes tailored to your health needs.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <div className="flex h-14 w-full items-center rounded-lg bg-white dark:bg-background-dark shadow-md dark:shadow-sm dark:ring-1 dark:ring-white/10">
            <span className="material-symbols-outlined pl-4 text-gray-400">search</span>
            <input
              className="search-input"
              placeholder="Search for recipes, ingredients..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
            <span className="material-symbols-outlined px-4 text-gray-400 cursor-pointer">mic</span>
            <div className="h-8 border-l border-gray-200 dark:border-gray-700 mx-2"></div>
            <button className="flex items-center justify-center px-4 cursor-pointer">
              <span className="material-symbols-outlined text-gray-500">tune</span>
            </button>
          </div>
        </div>

     
       

        {/* Recipe Grid */}
        <RecipeGrid recipes={filteredRecipes} onSelect={setSelectedRecipe} />

        {/* Recipe Modal */}
        {selectedRecipe && (
          <RecipeDetailsModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        )}
      </main>

      {/* Floating button */}
      <button className="fab">
        <span className="material-symbols-outlined text-3xl">auto_awesome</span>
      </button>
    </div>
  );
};

export default DietRecipesPage;
