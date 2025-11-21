import SymptomEntry from "../models/SymptomEntry.js";
import User from "../models/User.js";
import MedSchedule from "../models/MedSchedule.js";

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
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Fetch all active medications for the user
    const medications = await MedSchedule.find({
      userId,
      startDate: { $lte: now },
      endDate: { $gte: today }
    }).sort({ createdAt: -1 });

    // Add status based on adherence log for today
    const medsWithStatus = medications.map(med => {
      const todayAdherence = med.adherenceLog?.find(log => {
        const logDate = new Date(log.date);
        return logDate.toDateString() === today.toDateString();
      });

      return {
        _id: med._id,
        medName: med.medName,
        dosage: med.dosage,
        times: med.times,
        notes: med.notes,
        status: todayAdherence?.status || 'pending',
        startDate: med.startDate,
        endDate: med.endDate
      };
    });

    return medsWithStatus;
  } catch (error) {
    console.error("Error fetching medication schedule:", error);
    return [];
  }
};

const getDietPlan = async (userId) => {
  return {
    day: "Monday",
    meals: []
  };
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
