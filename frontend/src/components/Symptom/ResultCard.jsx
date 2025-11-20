import React from "react";
import { AlertTriangle } from "lucide-react";

const severityColors = {
  low: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  high: "bg-red-100 text-red-700 border-red-300",
};

const ResultCard = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="p-4 bg-white shadow rounded-lg animate-pulse">
        <p className="text-gray-600">Analyzing your symptoms… 🧠⚡</p>
      </div>
    );
  }

  if (!result) return null;

  const severity = result?.severity || "low";

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mt-4">
      <h2 className="text-xl font-semibold mb-3">AI Diagnosis Result</h2>

      {/* Severity Badge */}
      <div
        className={`px-3 py-2 rounded-md border w-fit mb-3 font-semibold ${severityColors[severity]}`}
      >
        Severity: {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </div>

      {/* High Severity Warning */}
      {severity === "high" && (
        <div className="flex items-center gap-2 bg-red-100 text-red-700 border border-red-300 p-3 rounded-md mb-4">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm font-semibold">
            ⚠️ This symptom may require medical attention.
          </p>
        </div>
      )}

      {/* Predicted Condition */}
      <p className="text-lg">
        <strong>Detected Condition:</strong> {result.predicted_condition}
      </p>

      {/* Image Preview */}
      {result.image_url && (
        <img
          src={result.image_url}
          alt="Uploaded symptom"
          className="mt-4 w-40 rounded-lg border shadow-sm"
        />
      )}

      {/* Recommendations */}
      <div className="mt-5">
        <h3 className="text-lg font-semibold mb-2">Recommendations</h3>

        {/* Diet */}
        <div className="mb-3">
          <h4 className="font-medium text-gray-700">🥗 Diet Suggestions</h4>
          <ul className="list-disc ml-5 text-gray-600">
            {result.recommendations?.diet?.length ? (
              result.recommendations.diet.map((item, i) => (
                <li key={i}>{item}</li>
              ))
            ) : (
              <li>No diet suggestions provided.</li>
            )}
          </ul>
        </div>

        {/* Lifestyle */}
        <div className="mb-3">
          <h4 className="font-medium text-gray-700">🧘 Lifestyle Suggestions</h4>
          <ul className="list-disc ml-5 text-gray-600">
            {result.recommendations?.habits?.length ? (
              result.recommendations.habits.map((item, i) => (
                <li key={i}>{item}</li>
              ))
            ) : (
              <li>No lifestyle tips provided.</li>
            )}
          </ul>
        </div>

        {/* Doctor Advice */}
        <div className="mb-3">
          <h4 className="font-medium text-gray-700">👨‍⚕️ Doctor Advice</h4>
          <p className="text-gray-600">
            {result.recommendations?.doctor || "No doctor advice provided."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
