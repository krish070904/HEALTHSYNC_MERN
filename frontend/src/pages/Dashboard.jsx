import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";
import SymptomCard from "../components/SymptomCard";
import AlertCard from "../components/AlertsCard.jsx";
import MedScheduleCard from "../components/MedicationCard.jsx";
import DietCard from "../components/DietCard.jsx";
import ReportCard from "../components/ReportsCard.jsx";
import SymptomTrendsChart from "../components/SymptomTrendsChart.jsx";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    symptomEntries: [],
    alerts: [],
    medSchedule: [],
    dietPlan: { meals: [] },
    summary: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-grid">
      <SymptomCard entries={data.symptomEntries} />
      <AlertCard alerts={data.alerts} />
      <MedScheduleCard meds={data.medSchedule} />
      <DietCard diet={data.dietPlan} />
      <ReportCard summary={data.summary} />
      <SymptomTrendsChart entries={data.symptomEntries} />
    </div>
  );
};

export default Dashboard;