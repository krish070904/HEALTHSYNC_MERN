import React from "react";

const AlertsCard = ({ alerts }) => {
  const getSeverityColor = (severity) => {
    if (severity >= 70) return "bg-red-500";
    if (severity >= 40) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/2 lg:w-1/3">
      <h2 className="text-lg font-semibold mb-2">Alerts & Notifications</h2>
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.map((alert) => (
          <li
            key={alert._id}
            className={`flex justify-between items-center p-2 rounded ${getSeverityColor(alert.severity)} text-white cursor-pointer`}
            onClick={() => alert("Show modal with full details")}
          >
            <span className="truncate">{alert.message}</span>
            <span className="font-bold">{alert.severity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertsCard;
