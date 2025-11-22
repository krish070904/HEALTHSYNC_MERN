import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Consent from "./pages/Consent";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SymptomEntryPage from "./pages/SymptomEntryPage";
import DailyMonitoringPage from "./pages/DailyMonitoringPage";
import DietRecipesPage from "./pages/DietRecipesPage"; 
import NotificationsPage from "./pages/NotificationsPage";
import ChatPage from "./pages/ChatPage";
import MedicationScheduler from "./pages/MedicationScheduler";
import MainLayout from "./components/MainLayout";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/consent" element={<Consent />} />

        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diet-recipes" element={<DietRecipesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/scheduler" element={<MedicationScheduler />} />
          <Route path="/symptom-entry" element={<SymptomEntryPage />} />
          <Route path="/daily-monitoring" element={<DailyMonitoringPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;