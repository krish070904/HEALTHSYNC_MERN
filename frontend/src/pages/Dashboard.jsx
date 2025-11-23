import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";
import SymptomCard from "../components/Dashboard/SymptomCard";
import AlertCard from "../components/Dashboard/AlertsCard";
import MedScheduleCard from "../components/Dashboard/MedicationCard";
import DietCard from "../components/Dashboard/DietCard";
import ReportsCard from "../components/Dashboard/ReportsCard";
import SymptomTrendsChart from "../components/Dashboard/SymptomTrendsChart";
import sthethoscope from "../assets/DashboardAssets/stethoscope_6467872.png";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    symptomEntries: [],
    alerts: [],
    medSchedule: [],
    dietPlan: { meals: [] },
    summary: {},
  });

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const dashboardData = await getDashboardData();
      setData(dashboardData);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchData(true);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleManualRefresh = () => fetchData(true);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">My Health Dashboard</h1>
          <p className="text-subtle-light mt-1">Welcome back, here's your health overview.</p>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh dashboard data"
        >
          <span className="material-symbols-outlined">
            {refreshing ? "progress_activity" : "refresh"}
          </span>
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <main className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <div className="w-full lg:col-span-2 xl:col-span-2 bg-surface-light dark:bg-surface-dark rounded-DEFAULT shadow-soft overflow-hidden">
          <div className="p-6 border-b border-border-light flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <img src={sthethoscope} alt="Stethoscope" className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Symptom Trends</h2>
          </div>
          <div className="p-6 h-64">
            <SymptomTrendsChart entries={data.symptomEntries} />
          </div>
        </div>

        <AlertCard alerts={data.alerts} />
        <MedScheduleCard meds={data.medSchedule} />
        <DietCard diet={data.dietPlan} />
        <ReportsCard />
      </main>
    </div>
  );
};

export default Dashboard;
