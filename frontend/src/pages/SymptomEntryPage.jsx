import React, { useState } from "react";
import SymptomForm from "../components/Symptom/SymptomForm";
import ImagePreview from "../components/Symptom/ImagePreview";
import ResultCard from "../components/Symptom/ResultCard";

const SymptomEntryPage = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen p-5 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-5">Symptom Analysis</h1>

      {/* --- FORM SECTION --- */}
      <SymptomForm
        setResult={setResult}
        setImagePreview={setImagePreview}
        setLoading={setLoading}
      />

      {/* --- IMAGE PREVIEW SECTION --- */}
      {imagePreview && (
        <div className="w-full md:w-2/3 lg:w-1/2 mt-5">
          <ImagePreview image={imagePreview} />
        </div>
      )}

      {/* --- LOADING SKELETON --- */}
      {loading && (
        <div className="w-full md:w-2/3 lg:w-1/2 mt-6 animate-pulse">
          <div className="h-40 bg-gray-300 rounded-md mb-3"></div>
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 rounded"></div>
        </div>
      )}

      {/* --- RESULT SECTION --- */}
      {result && !loading && (
        <div className="w-full md:w-2/3 lg:w-1/2 mt-6">
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
};

export default SymptomEntryPage;