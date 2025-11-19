import React from "react";

const SleepForm = ({ sleep, setSleep }) => {
  return (
    <div className="card">
      <h2 className="section-title">Sleep</h2>

      <label>Hours Slept</label>
      <input
        type="number"
        value={sleep.hours}
        onChange={(e) => setSleep({ ...sleep, hours: e.target.value })}
        className="input"
        min="0"
        max="24"
      />

      <label>Quality (1–5)</label>
      <select
        value={sleep.quality}
        onChange={(e) => setSleep({ ...sleep, quality: e.target.value })}
        className="input"
      >
        <option value="">Select</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  );
};

export default SleepForm;
