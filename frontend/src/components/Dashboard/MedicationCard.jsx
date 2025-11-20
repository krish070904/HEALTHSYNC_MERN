import React, { useState } from "react";
import axios from "../../services/api";

const MedicationCard = ({ meds = [], refresh }) => {
  const [updating, setUpdating] = useState(false);

  const markAdherence = async (medId, status) => {
    try {
      setUpdating(true);
      const today = new Date().toISOString().slice(0, 10);
      await axios.put(`/medications/${medId}/adherence`, { date: today, status });
      refresh?.();
    } catch (err) {
      console.error(err);
      alert("Failed to update adherence. Try again!");
    } finally {
      setUpdating(false);
    }
  };

  if (!meds || meds.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/2 lg:w-1/3">
        <h2 className="text-lg font-semibold mb-2">Today's Medications</h2>
        <p>No medications scheduled for today.</p>
      </div>
    );
  }

  const todayStr = new Date().toDateString();

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/2 lg:w-1/3">
      <h2 className="text-lg font-semibold mb-2">Today's Medications</h2>
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {meds.map((med) => {
          const todayLog = med.adherenceLog?.find(
            (log) => new Date(log.date).toDateString() === todayStr
          );
          const alreadyMarked = Boolean(todayLog);
          const todayStatus = todayLog?.status;

          return (
            <li
              key={med._id}
              className="flex justify-between items-center p-2 border-b border-gray-200"
            >
              <div>
                <p className="font-medium">{med.medName}</p>
                <p className="text-sm text-gray-600">
                  {med.dosage} at {med.times?.join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={updating || alreadyMarked}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                  onClick={() => markAdherence(med._id, "taken")}
                >
                  Taken
                </button>
                <button
                  disabled={updating || alreadyMarked}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                  onClick={() => markAdherence(med._id, "skipped")}
                >
                  Skipped
                </button>
                {todayStatus && (
                  <span className="ml-2 text-gray-500">
                    Marked: {todayStatus.charAt(0).toUpperCase() + todayStatus.slice(1)}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MedicationCard;
