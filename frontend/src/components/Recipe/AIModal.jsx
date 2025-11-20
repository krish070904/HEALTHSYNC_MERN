import React, { useState } from "react";
import api from "../services/api"; // your backend api

const AIModal = ({ onClose, onGenerate }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // call backend to get AI-generated meals
      const res = await api.post("/ai/generate", { query });
      // returns [{ recipe, image, calories, protein, steps, ingredients, youtube }]
      onGenerate(res.data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-background-dark rounded-lg shadow-lg w-96 p-4">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-2">Ask AI for meals</h2>
        <textarea
          className="w-full p-2 border rounded mb-2 dark:bg-background-dark dark:text-white"
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="I want Indian vegetarian meals..."
        />
        <button
          className="bg-primary text-white px-4 py-2 rounded w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Meals"}
        </button>
      </div>
    </div>
  );
};

export default AIModal;
