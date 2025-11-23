import React, { useState, useEffect, useRef } from "react";
import "../styles/SymptomEntryPage.css";

import SymptomForm from "../components/Symptom/SymptomForm";
import ImagePreview from "../components/Symptom/ImagePreview";
import ResultCard from "../components/Symptom/ResultCard";
import FuturisticLoader from "../components/Symptom/FuturisticLoader";

const SymptomEntryPage = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (result && !loading && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result, loading]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto font-display text-text-light bg-background-light min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Symptom Analysis</h1>
        <p className="text-subtle-light mt-1">
          Enter your symptoms and upload an image for AI review.
        </p>
      </header>

      <main className="flex flex-col gap-8">
        {/* Top Section: Form & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <SymptomForm
            setResult={setResult}
            setImagePreview={setImagePreview}
            setLoading={setLoading}
          />

          <div className="flex flex-col gap-6">
            <div className="bg-surface-light rounded-DEFAULT shadow-soft p-5 sm:p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4 text-text-light">Image Preview</h3>
              <ImagePreview image={imagePreview} />
            </div>
          </div>
        </div>

        {/* Bottom Section: Result or Loader */}
        <div className="w-full" ref={resultRef}>
          {loading && <FuturisticLoader />}
          {!loading && result && (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <ResultCard result={result} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SymptomEntryPage;
