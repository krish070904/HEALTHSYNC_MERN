import { useState } from "react";
import axios from "axios";

const AIBox = ({ onClose, setRecipes }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/ai/generate",
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecipes(res.data); // update main recipes grid
      onClose();
    } catch (err) {
      console.error(err);
      alert("AI generation failed");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-background-dark p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">Generate Recipes</h2>
        <input
          type="text"
          placeholder="What do you want to eat?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleGenerate}
          className="bg-primary text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        <button onClick={onClose} className="mt-2 text-gray-500 w-full">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AIBox;
