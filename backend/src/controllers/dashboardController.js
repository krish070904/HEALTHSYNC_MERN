import SymptomEntry from "../models/SymptomEntry.js";
import User from "../models/User.js";
import MedSchedule from "../models/MedSchedule.js";

import DietPlan from "../models/DietPlan.js";

// ------------------------ HELPERS ------------------------

const getRecentSymptoms = async (userId, limit = 10) => {
  return await SymptomEntry.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const getActiveAlerts = async (userId) => {
  return await SymptomEntry.find({ userId, alertFlag: true })
    .sort({ createdAt: -1 });
};


const getMedicationSchedule = async (userId) => {
  try {
    console.log("=== getMedicationSchedule called ===");
    console.log("userId:", userId);
    
    const now = new Date();
    console.log("Current date/time:", now);

    // Match the logic from getUserMedications - fetch all medications where endDate >= today
    // This will include medications that start today, started in the past, or will start in the future
    const medications = await MedSchedule.find({
      userId,
      endDate: { $gte: now }
    }).sort({ startDate: 1 });

    console.log(`Found ${medications.length} total medications for user`);
    
    if (medications.length > 0) {
      console.log("Sample medication:", JSON.stringify(medications[0], null, 2));
    }

    // Process medications with status
    const processedMeds = medications.map(med => {
      // Check today's adherence log
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayLog = med.adherenceLog?.find(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === today.getTime();
      });

      return {
        _id: med._id,
        medName: med.medName,
        dosage: med.dosage,
        times: med.times,
        notes: med.notes,
        status: todayLog ? todayLog.status : "pending",
        startDate: med.startDate,
        endDate: med.endDate
      };
    });

    console.log("Processed medications:", JSON.stringify(processedMeds, null, 2));
    console.log("=== getMedicationSchedule complete ===");
    
    return processedMeds;
  } catch (error) {
    console.error("Error in getMedicationSchedule:", error);
    return [];
  }
};

const getDietPlan = async (userId) => {
  try {
    const dietPlan = await DietPlan.findOne({ userId });
    if (!dietPlan) return { day: "Today", meals: [] };

    // Get today's day name (e.g., "Monday")
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[new Date().getDay()];

    const todayMeals = dietPlan.dailyMeals.find(d => d.day === todayName);
    
    return {
      day: todayName,
      meals: todayMeals ? todayMeals.meals : []
    };
  } catch (error) {
    console.error("Error fetching diet plan:", error);
    return { day: "Today", meals: [] };
  }
};

const getSeverityMetrics = (entries) => {
  if (!entries.length) {
    return { min: 0, max: 0, avg: 0 };
  }

  const scores = entries.map(e => e.severityScore);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  return { min, max, avg };
};

const getWeeklySeverity = async (userId) => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const entries = await SymptomEntry.find({
    userId,
    createdAt: { $gte: oneWeekAgo }
  });

  if (!entries.length) return { avg: 0, count: 0 };

  const total = entries.reduce((sum, e) => sum + (e.severityScore || 0), 0);
  const avg = total / entries.length;

  return { avg, count: entries.length };
};

const getUnacknowledgedAlertCount = async (userId) => {
  return await SymptomEntry.countDocuments({
    userId,
    alertFlag: true
  });
};

const getBMI = (user) => {
  if (!user.height || !user.weight) return null;

  const heightMeters = user.height / 100;
  return Number((user.weight / (heightMeters * heightMeters)).toFixed(2));
};

// ------------------------ MAIN CONTROLLER ------------------------

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔥 YOU FORGOT THIS LINE EARLIER
    const user = await User.findById(userId);

    const [
      recentSymptoms,
      alerts,
      medicationSchedule,
      dietPlan,
      weeklySeverity,
      alertCount
    ] = await Promise.all([
      getRecentSymptoms(userId),
      getActiveAlerts(userId),
      getMedicationSchedule(userId),
      getDietPlan(userId),
      getWeeklySeverity(userId),
      getUnacknowledgedAlertCount(userId)
    ]);

    const severityMetrics = getSeverityMetrics(recentSymptoms);
    const bmi = getBMI(user);

    res.json({
      recentSymptoms,
      alerts,
      medicationSchedule,
      dietPlan,
      severityMetrics,
      weeklySeverity,
      alertCount,
      bmi
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
