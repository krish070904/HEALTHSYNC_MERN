const WaterForm = ({ water, setWater }) => {
  return (
    <div className="card">
      <h2 className="section-title">Water Intake</h2>

      <label>Liters</label>
      <input
        type="number"
        value={water.liters}
        onChange={(e) =>
          setWater({ liters: e.target.value })
        }
        className="input"
        min="0"
        step="0.1"
      />
    </div>
  );
};

export default WaterForm;
