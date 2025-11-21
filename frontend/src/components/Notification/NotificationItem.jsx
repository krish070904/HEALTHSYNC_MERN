import React, { useState } from "react";
import api from "../../services/api";

// Map both string and numeric severities to colors
const severityColors = {
  low: { border: "border-green-500", bg: "bg-green-100", text: "text-green-600", label: "Low" },
  medium: { border: "border-yellow-500", bg: "bg-yellow-100", text: "text-yellow-600", label: "Medium" },
  high: { border: "border-red-500", bg: "bg-red-100", text: "text-red-600", label: "High" },
  50: { border: "border-yellow-500", bg: "bg-yellow-100", text: "text-yellow-600", label: "Medium" },
  100: { border: "border-red-500", bg: "bg-red-100", text: "text-red-600", label: "High" },
};

const NotificationItem = ({ alert, setAlerts }) => {
  const [expanded, setExpanded] = useState(false);

  // Determine severity key
  const sevKey = typeof alert.severity === "string" ? alert.severity.toLowerCase() : alert.severity;
  const sev = severityColors[sevKey] || severityColors.low;

  const markResolved = async () => {
    try {
      await api.put(`/alerts/${alert._id}/status`, { status: "resolved" });
      setAlerts(prev => prev.map(a => (a._id === alert._id ? { ...a, status: "resolved" } : a)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`flex flex-col cursor-pointer rounded-lg border-l-4 ${sev.border} bg-white p-5 shadow-sm dark:bg-white/5`}>
      <div className="flex justify-between items-start gap-4" onClick={() => setExpanded(prev => !prev)}>
        <div className="flex flex-grow items-start gap-4">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${sev.bg} ${sev.text}`}>
            <span className="material-symbols-outlined text-3xl">
              {alert.type === "medication" ? "notifications_active" : "report"}
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1">
            <p className="text-base font-bold">{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert</p>
            <p className="text-sm text-[#8a7b60] dark:text-white/60">{alert.message}</p>
            <p className="text-xs text-[#8a7b60] dark:text-white/60">{new Date(alert.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${sev.bg} ${sev.text}`}>
            {sev.label}
          </div>
        </div>
        {alert.status !== "resolved" && (
          <button onClick={(e) => { e.stopPropagation(); markResolved(); }} className="ml-4 flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-bold text-white">
            <span className="material-symbols-outlined mr-1.5 text-base">check_circle</span> Resolve
          </button>
        )}
      </div>

      {expanded && alert.details && (
        <div className="mt-2 pl-16 flex flex-col gap-4">
          <p className="text-sm font-semibold text-[#181511] dark:text-background-light">Details:</p>
          <p className="text-sm text-[#8a7b60] dark:text-white/60">{alert.details}</p>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
