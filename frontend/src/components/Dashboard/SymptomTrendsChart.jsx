import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SymptomTrendsChart = ({ entries = [] }) => {
  const data = entries.map((entry) => ({
    date: new Date(entry.createdAt).toLocaleDateString(),
    severity: entry.severityScore || 0,
  }));

  const getBarColor = (severity) => {
    if (severity >= 86) return "#cf1322";  // very high
    if (severity >= 71) return "#ff7875";  // high
    if (severity >= 51) return "#fa8c16";  // mid-high
    if (severity >= 31) return "#ffa940";  // mid-low
    return "#52c41a";                      // low
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="severity" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={getBarColor(entry.severity)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SymptomTrendsChart;
