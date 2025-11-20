import fork from "../../assets/DashboardAssets/cutlery.png"
const DietCard = ({ diet }) => {
  const meals = diet?.meals || [];
  return (
    <div className="w-full lg:col-span-1 xl:col-span-1 bg-surface-light dark:bg-surface-dark rounded-DEFAULT shadow-soft overflow-hidden">
      <div className="p-6 border-b border-border-light flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
          <img src={fork} alt="Pill" className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Today's Diet</h2>
      </div>
      <div className="p-6 space-y-4">
        {meals.length === 0 ? <p>No meals scheduled</p> : meals.map((meal, idx) => (
          <div key={idx}>
            <p className="font-semibold text-text-light dark:text-text-dark">{meal.time}</p>
            <p className="text-sm text-subtle-light dark:text-subtle-dark">{meal.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietCard;
