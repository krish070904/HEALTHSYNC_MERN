const MoodForm = ({ mood, setMood }) => {
  return (
    <div className="card">
      <h2 className="section-title">Mood</h2>

      <label>Mood Score</label>
      <input
        type="range"
        min="1"
        max="5"
        value={mood.score}
        onChange={(e) => setMood({ ...mood, score: e.target.value })}
      />

      <label>Notes</label>
      <textarea
        className="input"
        value={mood.note}
        onChange={(e) => setMood({ ...mood, note: e.target.value })}
      ></textarea>
    </div>
  );
};

export default MoodForm;
