import React, { useState, useEffect } from "react"; // ✅ must import hooks
import RecipeGrid from "../components/Recipe/RecipeGrid";
import RecipeDetailsModal from "../components/Recipe/RecipeDetailsModal";
import AIBox from "../components/Recipe/AIBox"; // make sure AIBox is imported
import api from "../services/api";
import "../styles/MealPage.css";

const DietRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showAIBox, setShowAIBox] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({ search: "" }); // ✅ define filters

  // Fetch meals
  const fetchRecipes = async () => {
    try {
      const res = await api.get("/diet");
      
      // Check if dailyMeals exists
      if (!res.data || !res.data.dailyMeals) {
        console.log("No diet plan found");
        setRecipes([]);
        setFilteredRecipes([]);
        return;
      }

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
      console.error("Error fetching diet plan:", err.response?.status, err.response?.data?.message);
      
      // If 404, user doesn't have a diet plan yet
      if (err.response?.status === 404) {
        console.log("No diet plan found for user. Please generate one first.");
        setRecipes([]);
        setFilteredRecipes([]);
      }
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Search filter
  useEffect(() => {
    let filtered = [...recipes];
    if (filters.search) {
      filtered = filtered.filter((r) =>
        r.recipe.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
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
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Recipe Grid */}
        <RecipeGrid recipes={filteredRecipes} onSelect={setSelectedRecipe} />

        {/* Recipe Modal */}
        {selectedRecipe && (
          <RecipeDetailsModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </main>

      {/* Floating AI button */}
      <button className="fab" onClick={() => setShowAIBox(true)}>
        <span className="material-symbols-outlined text-3xl">auto_awesome</span>
      </button>

      {/* AIBox */}
      {showAIBox && (
        <AIBox
          onClose={() => setShowAIBox(false)}
          setRecipes={(aiRecipes) => {
            setFilteredRecipes((prev) => [...aiRecipes, ...prev]);
          }}
        />
      )}
    </div>
  );
};

export default DietRecipesPage;
