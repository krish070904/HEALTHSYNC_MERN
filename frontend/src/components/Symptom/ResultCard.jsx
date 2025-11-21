import React from "react";
import { AlertTriangle } from "lucide-react";
import "../../styles/SymptomEntryPage.css";

const severityColors = {
  low: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  high: "bg-red-100 text-red-700 border-red-300",
};

const ResultCard = ({ result }) => {
  if (!result) return null;
  const severity = result?.severity || "low";

  return (
    <div className="bg-surface-light rounded-DEFAULT shadow-soft p-5 sm:p-6">
      <h2 className="text-xl font-bold mb-4">AI Analysis Result</h2>

      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${severityColors[severity]}`}>
        {severity === "high" ? "⚠️" : severity === "medium" ? "😐" : "✅"}{" "}
        {severity.charAt(0).toUpperCase() + severity.slice(1)} Severity
      </div>

      {severity === "high" && (
        <div className="flex items-center gap-2 bg-red-100 text-red-700 border border-red-300 p-3 rounded-md mt-3 mb-3 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm font-semibold">
            The symptom may require immediate medical attention.
          </p>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-semibold">Detected Condition:</h3>
        <p>{result.predicted_condition}</p>
      </div>

      {result.image_url && (
        <img
          src={result.image_url}
          alt="Symptom"
          className="mt-4 w-full rounded-lg border shadow-sm"
        />
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-background-light rounded-lg">
          <h4 className="font-semibold text-sm mb-1">Diet Suggestions</h4>
          <ul className="list-disc ml-5 text-gray-600">
            {result.recommendations?.diet?.length
              ? result.recommendations.diet.map((item, i) => <li key={i}>{item}</li>)
              : <li>No diet suggestions.</li>}
          </ul>
        </div>
        <div className="p-4 bg-background-light rounded-lg">
          <h4 className="font-semibold text-sm mb-1">Lifestyle Tips</h4>
          <ul className="list-disc ml-5 text-gray-600">
            {result.recommendations?.habits?.length
              ? result.recommendations.habits.map((item, i) => <li key={i}>{item}</li>)
              : <li>No lifestyle tips.</li>}
          </ul>
        </div>
        <div className="p-4 bg-background-light rounded-lg">
          <h4 className="font-semibold text-sm mb-1">Doctor Advice</h4>
          <p className="text-gray-600">
            {result.recommendations?.doctor || "No doctor advice."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
