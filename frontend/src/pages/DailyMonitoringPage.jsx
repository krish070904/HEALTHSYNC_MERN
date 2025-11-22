import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDailyMonitoring } from "../services/dailyMonitoringService";

// ✅ FIXED imports
import { SleepForm } from "../components/dailyMonitoring/SleepForm";
import { WaterForm } from "../components/dailyMonitoring/WaterForm";
import { MealForm } from "../components/dailyMonitoring/MealForm";
import { MoodForm } from "../components/dailyMonitoring/MoodForm";
import { VitalsForm } from "../components/dailyMonitoring/VitalsForm";
import { SymptomsForm } from "../components/dailyMonitoring/SymptomsForm";
import { SubmitCard } from "../components/dailyMonitoring/SubmitCard";

const DailyMonitoringPage = () => {
  const navigate = useNavigate();

  // ✅ You forgot this earlier (causing SleepForm is not defined)
  const [sleep, setSleep] = useState({ hours: 6, quality: 3 });

  const [water, setWater] = useState({ liters: 6 });
  const [meals, setMeals] = useState({
    breakfast: true,
    lunch: false,
    dinner: false,
  });
  const [mood, setMood] = useState({ score: 4, note: "" });
  const [vitals, setVitals] = useState({
    sugar: "110",
    bp: "120/80",
    weight: "75.5",
  });
  const [symptoms, setSymptoms] = useState({ severity: 2, note: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // Convert BP into numbers
    const [sys, dia] = (vitals.bp || "0/0").split("/");

    const payload = {
      date: new Date(),
      sleep,
      water,
      meals,
      mood,
      vitals: {
        sugar: Number(vitals.sugar),
        bpHigh: Number(sys),
        bpLow: Number(dia),
        weight: Number(vitals.weight),
      },
      symptoms,
    };

    try {
      await createDailyMonitoring(payload);
      alert("Daily Log Saved Successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving daily monitoring:", err);
      alert(err.message || "Error saving log. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-gray-800 dark:text-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
            Daily Check-In
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
            Track your daily health in under 20 seconds.
          </p>
        </header>

        <div className="mb-8">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-saffron h-1.5 rounded-full"
              style={{ width: "33%" }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SleepForm sleep={sleep} setSleep={setSleep} />
          <WaterForm water={water} setWater={setWater} />
          <MealForm meals={meals} setMeals={setMeals} />
          <MoodForm mood={mood} setMood={setMood} />
          <VitalsForm vitals={vitals} setVitals={setVitals} />
          <SymptomsForm symptoms={symptoms} setSymptoms={setSymptoms} />
        </div>

        <SubmitCard loading={loading} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default DailyMonitoringPage;
