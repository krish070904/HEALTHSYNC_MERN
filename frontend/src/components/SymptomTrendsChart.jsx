import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SymptomTrendsChart = ({ entries = [] }) => {
  const data = entries.map((e) => ({
    date: new Date(e.createdAt).toLocaleDateString(),
    severity: e.severityScore || 0,
  }));
  
  const getBarColor = (severity) => {
    if (severity >= 70) return "#ff4d4f"; // high
    if (severity >= 40) return "#faad14"; // medium
    return "#52c41a"; // low
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="severity">
          {data.map((entry, index) => (
            <Cell key={index} fill={getBarColor(entry.severity)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SymptomTrendsChart;
