import api from "./api";

export const createDailyMonitoring = async (data) => {
  try {
    const response = await api.post("/daily-monitoring/create", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error creating daily monitoring entry" };
  }
};

export const getDailyMonitoringHistory = async (limit = 30) => {
  try {
    const response = await api.get(`/daily-monitoring/history?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error fetching daily monitoring history" };
  }
};

export const getTodayMonitoring = async () => {
  try {
    const response = await api.get("/daily-monitoring/today");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error fetching today's monitoring" };
  }
};
