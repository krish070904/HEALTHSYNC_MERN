import api from "./api";

export const downloadReport = async (reportId) => {
  const res = await api.get(`/report/pdf/${reportId}`, { responseType: "blob" });
  return res.data;
};