import api from "./api";

export const getMedications = async () => {
  const res = await api.get("/medications");
  return res.data;
};

export const addMedication = async (data) => {
  const res = await api.post("/medications", data);
  return res.data;
};

export const updateAdherence = async (medId, date, status) => {
  const res = await api.put(`/medications/${medId}/adherence`, { date, status });
  return res.data;
};

export const deleteMedication = async (medId) => {
  const res = await api.delete(`/medications/${medId}`);
  return res.data;
};