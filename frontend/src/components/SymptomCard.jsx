import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SymptomCard = ({ entries = [] }) => {
  // Early return if no entries
    if (!entries.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/2 lg:w-1/3">
        <h2 className="text-lg font-semibold mb-2">Symptom Trends</h2>
        <p>No symptom entries yet.</p>
      </div>
    );
  }

  // Format and sort entries by date
  const data = entries
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((e) => ({
      date: new Date(e.createdAt).toLocaleDateString(),
      severity: e.severityScore,
      text: e.textDescription,
    }));

  // Function to color bars by severity
  const getBarColor = (severity) => {
    if (severity >= 70) return "#ff4d4f"; // high
    if (severity >= 40) return "#faad14"; // medium
    return "#52c41a"; // low
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/2 lg:w-1/3">
      <h2 className="text-lg font-semibold mb-2">Symptom Trends</h2>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`Severity: ${value}`, ""]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar dataKey="severity">
              {data.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.severity)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <h3 className="font-medium mb-2">Latest Entries</h3>
        <ul className="space-y-2 max-h-40 overflow-y-auto">
          {data.slice(-5).reverse().map((entry, index) => (
            <li
              key={index}
              className="flex justify-between border-b border-gray-200 py-1"
            >
              <span className="truncate">{entry.text}</span>
              <span className="font-semibold">{entry.severity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SymptomCard;
