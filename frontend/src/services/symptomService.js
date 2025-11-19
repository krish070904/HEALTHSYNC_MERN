import api from "./api";

export const addEntry = async (formData) => {
  const res = await api.post("/symptoms", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getEntries = async (minSeverity) => {
  const res = await api.get(`/symptoms?minSeverity=${minSeverity || 0}`);
  return res.data;
};