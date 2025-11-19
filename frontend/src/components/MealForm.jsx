const MealForm = ({ meals, setMeals }) => {
  return (
    <div className="card">
      <h2 className="section-title">Meals</h2>

      {["breakfast", "lunch", "dinner"].map((meal) => (
        <label key={meal} className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={meals[meal]}
            onChange={(e) =>
              setMeals({ ...meals, [meal]: e.target.checked })
            }
          />
          {meal.toUpperCase()}
        </label>
      ))}
    </div>
  );
};

export default MealForm;
