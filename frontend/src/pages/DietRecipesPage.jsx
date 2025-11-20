import React, { useEffect, useState } from "react";
import RecipeFilters from "../components/Recipe/RecipeFilters";
import RecipeGrid from "../components/RecipeGrid";
import RecipeDetailsModal from "../components/RecipeDetailsModal";
import api from "../services/api"; // updated

const DietRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [filters, setFilters] = useState({
    disease: "",
    dietType: "",
    mealType: "",
    search: "",
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchRecipes = async () => {
    try {
      const res = await api.get("/diet"); // changed from axios.get
      setRecipes(res.data.dailyMeals.flatMap(d => d.meals.map(m => ({
        id: `${d.day}-${m.mealType}`,
        day: d.day,
        ...m
      }))));
      setFilteredRecipes(res.data.dailyMeals.flatMap(d => d.meals.map(m => ({
        id: `${d.day}-${m.mealType}`,
        day: d.day,
        ...m
      }))));
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
      filtered = filtered.filter(r => r.recipe.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.mealType)
      filtered = filtered.filter(r => r.mealType.toLowerCase() === filters.mealType.toLowerCase());
    if (filters.dietType) filtered = filtered.filter(r => r.recipe.toLowerCase().includes(filters.dietType.toLowerCase()));
    setFilteredRecipes(filtered);
  }, [filters, recipes]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Diet Recipes</h1>
      <RecipeFilters filters={filters} setFilters={setFilters} />
      <RecipeGrid recipes={filteredRecipes} onSelect={setSelectedRecipe} />
      {selectedRecipe && (
        <RecipeDetailsModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default DietRecipesPage;
