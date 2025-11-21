import React, { useEffect, useState } from "react";
import NotificationFilters from "../components/Notification/NotificationFilters";
import NotificationsList from "../components/Notification/NotificationsList";
import api from "../services/api";

const NotificationsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({ type: "all", status: "" });
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/alerts");
      setAlerts(res.data.alerts);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const markAllResolved = async () => {
    try {
      await Promise.all(alerts.map(a => a.status !== "resolved" ? api.put(`/alerts/${a._id}/status`, { status: "resolved" }) : null));
      setAlerts(prev => prev.map(a => ({ ...a, status: "resolved" })));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    let typeMatch = filters.type === "all" || a.type.toLowerCase() === filters.type;
    let statusMatch = !filters.status || a.status === filters.status;
    return typeMatch && statusMatch;
  });

  return (
    <main className="px-4 py-8 sm:px-6 md:py-12 lg:px-16 xl:px-24">
      <div className="mx-auto max-w-4xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl">
              Notifications
            </p>
            <p className="text-base text-[#8a7b60] dark:text-white/60">
              You have <span className="font-bold text-[#181511] dark:text-white">{alerts.length} new</span> notifications.
            </p>
          </div>
          <button
            onClick={markAllResolved}
            className="flex h-11 min-w-[84px] items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white"
          >
            <span className="material-symbols-outlined text-xl">done_all</span>
            <span className="truncate">Mark All as Read</span>
          </button>
        </div>

        {/* Filters */}
        <NotificationFilters filters={filters} setFilters={setFilters} />

        {/* Alerts List */}
        {loading ? (
          <p>Loading alerts...</p>
        ) : (
          <NotificationsList alerts={filteredAlerts} setAlerts={setAlerts} />
        )}
      </div>
    </main>
  );
};

export default NotificationsPage;
