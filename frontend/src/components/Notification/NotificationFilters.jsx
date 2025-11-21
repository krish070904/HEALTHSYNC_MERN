import React from "react";

const NotificationFilters = ({ filters, setFilters }) => {
  const types = ["all", "symptom", "medication", "resolved"];
  return (
    <div className="sticky top-4 z-10 -mx-3 rounded-xl bg-background-light/80 p-2 backdrop-blur-sm dark:bg-background-dark/80">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilters(prev => ({ ...prev, type }))}
            className={`flex h-10 shrink-0 items-center gap-x-2 rounded-full bg-white px-4 text-sm font-medium dark:bg-white/10 ${
              filters.type === type ? "active-filter" : "text-[#8a7b60] dark:text-white/60"
            }`}
          >
            <p>{type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}</p>
            {type === "all" && <span className="grid size-5 place-items-center rounded-full bg-black/10 text-xs font-semibold">{filters.length}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationFilters;
