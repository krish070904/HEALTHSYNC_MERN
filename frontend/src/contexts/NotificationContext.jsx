import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/alerts");
      // Assuming backend returns an array of alerts
      setAlerts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const markAsResolved = async (id) => {
    try {
      await api.put(`/alerts/${id}/status`, { status: "resolved" });
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "resolved" } : a))
      );
      toast.success("Alert resolved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to resolve alert");
    }
  };

  const markAllAsResolved = async () => {
    try {
      const pending = alerts.filter((a) => a.status !== "resolved");
      await Promise.all(
        pending.map((a) => api.put(`/alerts/${a._id}/status`, { status: "resolved" }))
      );
      setAlerts((prev) => prev.map((a) => ({ ...a, status: "resolved" })));
      toast.success("All alerts resolved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to resolve all alerts");
    }
  };

  const unreadCount = alerts.filter((a) => a.status !== "resolved").length;

  return (
    <NotificationContext.Provider
      value={{ alerts, loading, fetchAlerts, markAsResolved, markAllAsResolved, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
