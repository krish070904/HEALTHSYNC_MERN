import React from "react";

const RecipeFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="Search recipes..."
        className="border rounded p-2 flex-1"
        value={filters.search}
        onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
      />
      <select
        value={filters.disease}
        onChange={e => setFilters(prev => ({ ...prev, disease: e.target.value }))}
        className="border rounded p-2"
      >
        <option value="">All Diseases</option>
        <option value="diabetes">Diabetes</option>
        <option value="cancer">Cancer</option>
        <option value="normal">Normal</option>
      </select>
      <select
        value={filters.dietType}
        onChange={e => setFilters(prev => ({ ...prev, dietType: e.target.value }))}
        className="border rounded p-2"
      >
        <option value="">All Diets</option>
        <option value="veg">Veg</option>
        <option value="non-veg">Non-Veg</option>
        <option value="jain">Jain</option>
      </select>
      <select
        value={filters.mealType}
        onChange={e => setFilters(prev => ({ ...prev, mealType: e.target.value }))}
        className="border rounded p-2"
      >
        <option value="">All Meals</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
      </select>
    </div>
  );
};

export default RecipeFilters;
