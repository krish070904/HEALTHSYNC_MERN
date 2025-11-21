import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../../services/api";
import "../../styles/SymptomEntryPage.css";

const SymptomForm = ({ setResult, setImagePreview, setLoading }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/avif"];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, WEBP, or AVIF images are allowed.");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return toast.error("Please describe your symptoms.");
    setSubmitting(true);
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("textDescription", text);
      if (image) formData.append("images", image);

      const res = await axios.post("/symptoms", formData);

      setResult(res.data);
      toast.success("Symptom analyzed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to analyze symptoms.");
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
    <div className="bg-surface-light rounded-DEFAULT shadow-soft p-5 sm:p-6">
      <h2 className="text-xl font-bold mb-4">Symptom Form</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="symptom-description"
            className="block text-sm font-medium text-text-light mb-1"
          >
            Describe your symptoms
          </label>
          <textarea
            id="symptom-description"
            rows={5}
            className="w-full rounded-lg border border-border-light focus:ring-primary-darker focus:border-primary-darker resize-none transition"
            placeholder="e.g., I have a persistent rash on my arm..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-text-light mb-1"
          >
            Upload an image
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-gray-400">
                upload_file
              </span>
              <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-darker hover:text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-darker focus-within:ring-offset-2"
                >
                  <span>Upload a file</span>
                  <input
                    type="file"
                    id="file-upload"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-500 mt-2">
                PNG, JPG, WEBP, AVIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full sm:w-auto flex-1 justify-center inline-flex items-center px-6 py-3 text-base font-medium rounded-lg shadow-sm text-white ${
              submitting
                ? "bg-primary-darker/70 cursor-not-allowed"
                : "bg-primary-darker hover:bg-primary"
            }`}
          >
            {submitting ? "Analyzing..." : "Submit for Analysis"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="w-full sm:w-auto justify-center inline-flex items-center px-6 py-3 text-base font-medium rounded-lg shadow-sm text-text-light bg-white hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SymptomForm;
