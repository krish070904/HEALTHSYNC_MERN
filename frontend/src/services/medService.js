// frontend/src/services/medServices.js
import api from "./api";

// Fetch all medications for the logged-in user
export const getMedications = async () => {
  try {
    const res = await api.get("/medications");
    return res.data;
  } catch (err) {
    console.error("Error fetching medications:", err);
    throw err;
  }
};

// Add a new medication schedule
export const addMedication = async (data) => {
  try {
    const res = await api.post("/medications", data);
    return res.data;
  } catch (err) {
    console.error("Error adding medication:", err);
    throw err;
  }
};

// Update adherence status for a medication
export const updateAdherence = async (id, data) => {
  try {
    const res = await api.put(`/medications/${id}/adherence`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating adherence:", err);
    throw err;
  }
};

// Delete a medication schedule
export const deleteMedication = async (id) => {
  try {
    const res = await api.delete(`/medications/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting medication:", err);
    throw err;
  }
};
