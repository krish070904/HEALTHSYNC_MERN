const SymptomsForm = ({ symptoms, setSymptoms }) => {
  return (
    <div className="card">
      <h2 className="section-title">Symptoms</h2>

      <label>Severity (0–5)</label>
      <input
        type="range"
        min="0"
        max="5"
        value={symptoms.severity}
        onChange={(e) =>
          setSymptoms({ ...symptoms, severity: Number(e.target.value) }) // ✅ cast to number
        }
      />

      <label>Notes</label>
      <textarea
        className="input"
        value={symptoms.note}
        onChange={(e) =>
          setSymptoms({ ...symptoms, note: e.target.value })
        }
      ></textarea>
    </div>
  );
};

export default SymptomsForm;
