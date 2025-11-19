import React, { useEffect, useState } from "react";
import NotificationFilters from "../components/NotificationFilters";
import NotificationsList from "../components/NotificationsList";
import api from "../services/api";

const NotificationsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [filters, setFilters] = useState({ type: "", status: "" });
  const [loading, setLoading] = useState(true);

  // Fetch alerts from backend
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/alerts");
      setAlerts(res.data.alerts);
      setFilteredAlerts(res.data.alerts);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();

    // Optional polling every 60s
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...alerts];
    if (filters.type) filtered = filtered.filter(a => a.type === filters.type);
    if (filters.status) filtered = filtered.filter(a => a.status === filters.status);
    setFilteredAlerts(filtered);
  }, [filters, alerts]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <NotificationFilters filters={filters} setFilters={setFilters} />
      {loading ? (
        <p>Loading alerts...</p>
      ) : (
        <NotificationsList alerts={filteredAlerts} setAlerts={setAlerts} />
      )}
    </div>
  );
};

export default NotificationsPage;
