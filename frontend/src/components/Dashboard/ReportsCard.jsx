import React, { useState } from "react";
import axios from "../../services/api";

const ReportsCard = () => {
  const [loading, setLoading] = useState(false);

  const downloadReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/report/pdf/download", {
        responseType: "blob", // important for files
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Filename
      link.setAttribute("download", "HealthReport.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("Failed to download report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/2 lg:w-1/3">
      <h2 className="text-lg font-semibold mb-4">Reports</h2>
      <button
        onClick={downloadReport}
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? "Downloading..." : "Download Latest Report"}
      </button>
    </div>
  );
};

export default ReportsCard;
