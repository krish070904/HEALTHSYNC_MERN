const SubmitCard = ({ loading, onSubmit }) => {
  return (
    <div className="card">
      <button
        disabled={loading}
        onClick={onSubmit}
        className={`btn-primary w-full ${loading ? "opacity-50" : ""}`}
      >
        {loading ? "Saving..." : "Save Today’s Log"}
      </button>
    </div>
  );
};

export default SubmitCard;
