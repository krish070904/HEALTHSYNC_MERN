import React, { useEffect, useState } from "react";
import NotificationFilters from "../components/Notification/NotificationFilters";
import NotificationsList from "../components/Notification/NotificationsList";
import api from "../services/api";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({ type: "all", status: "" });
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/alerts");
      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const markAllResolved = async () => {
    try {
      await Promise.all(
        alerts
          .filter((a) => a.status !== "resolved")
          .map((a) => api.put(`/alerts/${a._id}/status`, { status: "resolved" }))
      );
      setAlerts((prev) => prev.map((a) => ({ ...a, status: "resolved" })));
      toast.success("All alerts marked as resolved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark all as resolved");
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filters.type === "resolved") return a.status === "resolved";
    if (a.status === "resolved") return false;
    const typeMatch = filters.type === "all" || a.type.toLowerCase() === filters.type;
    const statusMatch = !filters.status || a.status === filters.status;
    return typeMatch && statusMatch;
  });

  return (
    <main className="px-4 py-6 sm:px-6 md:py-8 lg:px-8 xl:px-12 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Notifications
            </p>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              You have{" "}
              <span className="font-bold text-gray-900 dark:text-white">
                {alerts.length} new
              </span>{" "}
              notifications.
            </p>
          </div>

          <button
            onClick={markAllResolved}
            className="w-full sm:w-auto flex h-10 sm:h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 sm:px-6 text-sm font-bold text-white transition-transform active:scale-95 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">done_all</span>
            <span className="whitespace-nowrap">Mark All as Read</span>
          </button>
        </div>

        <NotificationFilters filters={filters} setFilters={setFilters} />

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
