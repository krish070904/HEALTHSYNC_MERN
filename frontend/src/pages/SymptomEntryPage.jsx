import React, { useState } from "react";
import "../styles/SymptomEntryPage.css"; // ✅ CSS import

import SymptomForm from "../components/Symptom/SymptomForm";
import ImagePreview from "../components/Symptom/ImagePreview";
import ResultCard from "../components/Symptom/ResultCard";



const SymptomEntryPage = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto font-display text-text-light bg-background-light min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Symptom Analysis</h1>
        <p className="text-subtle-light mt-1">
          Enter your symptoms and upload an image for AI review.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        {/* --- Form Section --- */}
        <div className="flex flex-col gap-8">
          <SymptomForm
            setResult={setResult}
            setImagePreview={setImagePreview}
            setLoading={setLoading}
          />
          {loading && (
            <div className="animate-pulse h-40 bg-gray-300 rounded-lg"></div>
          )}
        </div>

        {/* --- Result & Preview Section --- */}
        <div className="flex flex-col gap-6">
          {result && !loading && <ResultCard result={result} />}
          {imagePreview && (
            <div className="bg-surface-light rounded-DEFAULT shadow-soft sticky top-8 p-5 sm:p-6">
              <ImagePreview image={imagePreview} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SymptomEntryPage;
