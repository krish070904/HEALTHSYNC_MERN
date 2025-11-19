import User from "../models/User.js";
import SymptomEntry from "../models/SymptomEntry.js";


// --------------------------------------------
// Helper 1 — Get BMI
// --------------------------------------------
const getBMI = (user) => {
  if (!user.height || !user.weight) return null;

  const h = user.height / 100;
  return Number((user.weight / (h * h)).toFixed(2));
};


// --------------------------------------------
// Helper 2 — Get date range entries
// --------------------------------------------
const getSymptomEntries = async (userId, days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return await SymptomEntry.find({
    userId,
    createdAt: { $gte: since }
  }).sort({ createdAt: -1 });
};


// --------------------------------------------
// Helper 3 — Summary statistics
// --------------------------------------------
const getSummaryStats = (entries) => {
  if (!entries.length) {
    return {
      avgSeverity7: 0,
      avgSeverity30: 0,
      maxSeverity: 0,
      total: 0
    };
  }

  const sev = entries.map((e) => e.severityScore || 0);

  return {
    avgSeverity30: Number((sev.reduce((a, b) => a + b, 0) / sev.length).toFixed(2)),
    maxSeverity: Math.max(...sev),
    total: entries.length
  };
};


// --------------------------------------------
// Helper 4 — Alerts
// --------------------------------------------
const getAlerts = async (userId) => {
  return await SymptomEntry.find({
    userId,
    alertFlag: true
  }).sort({ createdAt: -1 });
};


// --------------------------------------------
// MAIN CONTROLLER — Raw JSON report
// --------------------------------------------
export const getUserReportData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1 — Fetch user
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Step 2 — Fetch symptom entries (last 30 days)
    const entries = await getSymptomEntries(userId, 30);

    // Step 3 — Summary
    const summary = getSummaryStats(entries);

    // Step 4 — Alerts
    const alerts = await getAlerts(userId);

    res.json({
      user: {
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        bmi: getBMI(user),
        diseaseTags: user.diseaseTags,
        dietType: user.dietType,
      },

      summary: {
        avgSeverity30: summary.avgSeverity30,
        maxSeverity: summary.maxSeverity,
        totalEntries: summary.total,
        alertCount: alerts.length,
      },

      entries: entries.map((e) => ({
        id: e._id,
        date: e.createdAt,
        description: e.textDescription,
        severity: e.severityScore,
        modelResult: e.modelResult,
        images: e.images,
      })),

      alerts
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
