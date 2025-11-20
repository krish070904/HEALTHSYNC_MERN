import React, { useState } from "react";
import api from "../../services/api";

const severityColors = {
  low: "bg-green-200",
  medium: "bg-yellow-200",
  high: "bg-red-200",
};

const NotificationItem = ({ alert, setAlerts }) => {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const markResolved = async () => {
    try {
      setUpdating(true);
      await api.put(`/alerts/${alert._id}/status`, { status: "resolved" });
      setAlerts(prev =>
        prev.map(a => (a._id === alert._id ? { ...a, status: "resolved" } : a))
      );
      setUpdating(false);
    } catch (err) {
      console.error(err);
      setUpdating(false);
    }
  };

  return (
    <div
      className={`border p-3 rounded cursor-pointer ${severityColors[alert.severity] || "bg-gray-200"}`}
      onClick={() => setExpanded(prev => !prev)}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{alert.type.toUpperCase()}</p>
          <p className="text-sm">{new Date(alert.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <span className={`px-2 py-1 rounded text-xs ${alert.status === "pending" ? "bg-blue-200" : "bg-gray-300"}`}>
            {alert.status.toUpperCase()}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="mt-2">
          <p>{alert.message}</p>
          {alert.status === "pending" && (
            <button
              onClick={(e) => { e.stopPropagation(); markResolved(); }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
              disabled={updating}
            >
              {updating ? "Updating..." : "Mark as Resolved"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
