import React from "react";

const NotificationFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-4 mb-4">
      <select
        value={filters.type}
        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
        className="border p-2 rounded"
      >
        <option value="">All Types</option>
        <option value="symptom">Symptom</option>
        <option value="medication">Medication</option>
        <option value="routine">Routine</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        className="border p-2 rounded"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>
  );
};

export default NotificationFilters;
