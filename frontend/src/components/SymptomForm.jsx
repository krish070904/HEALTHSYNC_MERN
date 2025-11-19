import React, { useState } from "react";
import axios from "../services/api";
import toast from "react-hot-toast";

const SymptomForm = ({ setResult, setImagePreview, setLoading }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Allowed image types
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Invalid file type
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG / JPG images are allowed.");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // prevents double-submit

    if (!text.trim()) {
      toast.error("Please describe your symptoms.");
      return;
    }

    // No image? allow but warn
    if (!image) {
      toast("No image uploaded. Proceeding with text only.", { icon: "⚠️" });
    }

    try {
      setSubmitting(true);
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("textDescription", text);
      if (image) formData.append("images", image);

      const res = await axios.post("/symptoms", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setResult(res.data); // backend returns the whole entry including AI results
      toast.success("Symptom analyzed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to analyze symptoms. Try again.");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setText("");
    setImage(null);
    setImagePreview(null);
  };

  return (
    <form
      className="bg-white shadow-md rounded-lg p-4 w-full md:w-2/3 lg:w-1/2"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-semibold mb-3">Describe Your Symptoms</h2>

      {/* Text */}
      <textarea
        className="w-full p-2 border rounded-md"
        rows="4"
        placeholder="Describe your symptoms here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Image */}
      <div className="mt-3">
        <p className="font-medium mb-1">Upload Image (optional)</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 rounded text-white ${
            submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default SymptomForm;
