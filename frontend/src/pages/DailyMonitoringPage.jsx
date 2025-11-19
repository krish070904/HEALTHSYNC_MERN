import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";   // 👈 ADD THIS

import SleepForm from "../components/SleepForm";
import WaterForm from "../components/WaterForm";
import MealForm from "../components/MealForm";
import MoodForm from "../components/MoodForm";
import VitalsForm from "../components/VitalsForm";
import SymptomsForm from "../components/SymptomsForm";
import SubmitCard from "../components/SubmitCard";

const DailyMonitoringPage = () => {
  const navigate = useNavigate();   // 👈 ADD THIS

  const [sleep, setSleep] = useState({ hours: "", quality: "" });
  const [water, setWater] = useState({ liters: "" });
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [mood, setMood] = useState({ score: 3, note: "" });
  const [vitals, setVitals] = useState({
    sugar: "",
    bpHigh: "",
    bpLow: "",
    weight: "",
  });
  const [symptoms, setSymptoms] = useState({ severity: 0, note: "" });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = {
        date: new Date(),
        sleep,
        water,
        meals,
        mood,
        vitals,
        symptoms,
      };

      await axios.post(
        "http://localhost:5000/api/daily-monitoring/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Daily Log Saved!");

      // 👉 Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      alert("Error saving log");
    }

    setLoading(false);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Daily Monitoring</h1>

      <div className="grid-layout">
        <SleepForm sleep={sleep} setSleep={setSleep} />
        <WaterForm water={water} setWater={setWater} />
        <MealForm meals={meals} setMeals={setMeals} />
        <MoodForm mood={mood} setMood={setMood} />
        <VitalsForm vitals={vitals} setVitals={setVitals} />
        <SymptomsForm symptoms={symptoms} setSymptoms={setSymptoms} />
      </div>

      <SubmitCard loading={loading} onSubmit={handleSubmit} />
    </div>
  );
};

export default DailyMonitoringPage;
