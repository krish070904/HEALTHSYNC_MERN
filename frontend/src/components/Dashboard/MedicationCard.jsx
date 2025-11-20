import React, { useState } from "react";
import axios from "../../services/api";

const MedicationCard = ({ meds = [], refresh }) => {
  if (!meds.length) return <p>No medications scheduled</p>;
  const [updating, setUpdating] = useState(false);

  const markAdherence = async (medId, status) => {
    try {
      setUpdating(true);
      const today = new Date().toISOString().slice(0, 10);
      await axios.put(`/medications/${medId}/adherence`, {
        date: today,
        status,
      });
      refresh?.(); // optional chaining in case refresh is not provided
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Early return if no medications
  if (!meds || meds.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/2 lg:w-1/3">
        <h2 className="text-lg font-semibold mb-2">Today's Medications</h2>
        <p>No medications scheduled for today.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/2 lg:w-1/3">
      <h2 className="text-lg font-semibold mb-2">Today's Medications</h2>
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {meds.map((med) => (
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
            <div className="flex gap-2">
              <button
                disabled={updating}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                onClick={() => markAdherence(med._id, "taken")}
              >
                Taken
              </button>
              <button
                disabled={updating}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => markAdherence(med._id, "skipped")}
              >
                Skipped
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicationCard;
