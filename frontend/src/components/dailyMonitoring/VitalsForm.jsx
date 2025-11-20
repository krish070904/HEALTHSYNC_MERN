const VitalsForm = ({ vitals, setVitals }) => {
  return (
    <div className="card">
      <h2 className="section-title">Daily Vitals</h2>

      <label>Blood Sugar</label>
      <input
        className="input"
        value={vitals.sugar}
        onChange={(e) => setVitals({ ...vitals, sugar: e.target.value })}
      />

      <label>BP High</label>
      <input
        className="input"
        value={vitals.bpHigh}
        onChange={(e) => setVitals({ ...vitals, bpHigh: e.target.value })}
      />

      <label>BP Low</label>
      <input
        className="input"
        value={vitals.bpLow}
        onChange={(e) => setVitals({ ...vitals, bpLow: e.target.value })}
      />

      <label>Weight (kg)</label>
      <input
        className="input"
        value={vitals.weight}
        onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
      />
    </div>
  );
};

export default VitalsForm;
