import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SymptomEntryPage from "./pages/SymptomEntryPage";
import DailyMonitoringPage from "./pages/DailyMonitoringPage";
import DietRecipesPage from "./pages/DietRecipesPage"; 
import NotificationsPage from "./pages/NotificationsPage";
import ChatPage from "./pages/ChatPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diet-recipes"
          element={
            <ProtectedRoute>
              <DietRecipesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/symptom-entry" element={<SymptomEntryPage />} />
        <Route path="/daily-monitoring" element={<DailyMonitoringPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
