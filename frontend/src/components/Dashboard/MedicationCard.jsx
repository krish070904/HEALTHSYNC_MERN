import React from "react";
import PillIcon from "../../assets/DashboardAssets/pill_8064036.png"; // adjust path if needed

const MedicationCard = ({ meds }) => {
  const safeMeds = Array.isArray(meds) ? meds : [];

  return (
    <div className="w-full lg:col-span-1 xl:col-span-2 bg-surface-light dark:bg-surface-dark rounded-DEFAULT shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border-light flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
          <img src={PillIcon} alt="Pill Icon" className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
          Medication Schedule
        </h2>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {safeMeds.length === 0 ? (
          <p>No medications scheduled</p>
        ) : (
          safeMeds.map((med) => (
            <div
              key={med._id}
              className="flex justify-between items-center p-3 rounded-lg border border-primary-darker bg-primary/10"
            >
              <div className="flex items-center space-x-3">
                <img src={PillIcon} alt="Pill" className="w-5 h-5" />
                <div>
                  <p className="font-medium text-text-light dark:text-text-dark">
                    {med.medName}
                  </p>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark">
                    {med.dosage}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                {med.status || "Upcoming"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicationCard;
