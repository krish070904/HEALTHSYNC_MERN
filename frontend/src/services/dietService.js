import api from "./api";

export const fetchDiet = async () => {
  const res = await api.get("/diet");
  return res.data;
};

export const generateDiet = async (preferences) => {
  const res = await api.post("/diet/generate", preferences);
  return res.data;
};
