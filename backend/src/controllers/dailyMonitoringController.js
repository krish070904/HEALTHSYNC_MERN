import DailyMonitoring from "../models/DailyMonitoring.js";
import User from "../models/User.js";
import { generatePersonalizedDietPlan } from "./aiDietController.js";
import { analyzeHealthTrends } from "../utils/aiModelUtils.js";

export const createDailyMonitoring = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if entry already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingEntry = await DailyMonitoring.findOne({
      userId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingEntry) {
      return res.status(400).json({
        message: "You have already submitted your daily monitoring for today",
        data: existingEntry
      });
    }

    // Create new entry
    const entry = new DailyMonitoring({
      userId,
      date: req.body.date || new Date(),
      sleep: req.body.sleep,
      water: req.body.water,
      meals: req.body.meals,
      mood: req.body.mood,
      vitals: req.body.vitals,
      symptoms: req.body.symptoms
    });

    const saved = await entry.save();

    // ✅ TRIGGER AI ANALYSIS & DIET GENERATION IN BACKGROUND
    processMonitoringData(userId, saved).catch(err => {
      console.error("Background processing error:", err);
    });

    res.status(201).json({
      message: "Daily monitoring saved successfully! AI analysis in progress...",
      data: saved
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Background processing for daily monitoring data
 * - Analyzes health trends with BioMistral AI
 * - Generates personalized diet plan
 * - Updates user context for chat personalization
 */
const processMonitoringData = async (userId, monitoringEntry) => {
  try {
    console.log(`🤖 Processing daily monitoring for user ${userId}`);

    // Get user data
    const user = await User.findById(userId);
    if (!user) return;

    // Get last 7 days of monitoring data for trend analysis
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentHistory = await DailyMonitoring.find({
      userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: -1 });

    // ✅ 1. Analyze health trends with BioMistral AI
    const healthAnalysis = await analyzeHealthTrends(user, recentHistory);
    console.log("✅ Health trends analyzed");

    // ✅ 2. Generate personalized diet plan based on monitoring data
    await generatePersonalizedDietPlan(userId, {
      monitoringData: monitoringEntry,
      healthAnalysis,
      recentHistory
    });
    console.log("✅ Diet plan generated");

    // ✅ 3. Update user's AI context for personalized chat
    await updateUserAIContext(userId, healthAnalysis);
    console.log("✅ User AI context updated");

  } catch (error) {
    console.error("Error in background processing:", error);
  }
};

/**
 * Update user's AI context for personalized chat responses
 */
const updateUserAIContext = async (userId, healthAnalysis) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Store AI context in user document (you may need to add this field to User model)
    user.aiContext = {
      lastUpdated: new Date(),
      healthSummary: healthAnalysis.summary,
      recommendations: healthAnalysis.recommendations,
      concerns: healthAnalysis.concerns,
      trends: healthAnalysis.trends
    };

    await user.save();
  } catch (error) {
    console.error("Error updating user AI context:", error);
  }
};

export const getDailyMonitoringHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 30;

    const history = await DailyMonitoring.find({ userId })
      .sort({ date: -1 })
      .limit(limit);

    res.json({
      message: "Daily monitoring history fetched successfully",
      data: history
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTodayMonitoring = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEntry = await DailyMonitoring.findOne({
      userId,
      date: { $gte: today, $lt: tomorrow }
    });

    res.json({
      message: todayEntry ? "Today's monitoring found" : "No entry for today",
      data: todayEntry,
      hasSubmittedToday: !!todayEntry
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get health insights based on monitoring history
 */
export const getHealthInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const history = await DailyMonitoring.find({
      userId,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    if (history.length === 0) {
      return res.json({
        message: "No monitoring data available",
        insights: null
      });
    }

    // Calculate insights
    const insights = {
      averageSleep: calculateAverage(history, 'sleep.hours'),
      averageWater: calculateAverage(history, 'water.liters'),
      averageMood: calculateAverage(history, 'mood.score'),
      sleepQuality: calculateAverage(history, 'sleep.quality'),
      mealConsistency: calculateMealConsistency(history),
      vitalsTrends: calculateVitalsTrends(history),
      totalDays: history.length
    };

    res.json({
      message: "Health insights generated successfully",
      insights,
      period: `${days} days`
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper functions
const calculateAverage = (history, field) => {
  const values = history
    .map(entry => {
      const keys = field.split('.');
      let value = entry;
      for (const key of keys) {
        value = value?.[key];
      }
      return value;
    })
    .filter(val => val != null && !isNaN(val));

  if (values.length === 0) return 0;
  return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
};

const calculateMealConsistency = (history) => {
  let totalMeals = 0;
  let possibleMeals = history.length * 3; // breakfast, lunch, dinner

  history.forEach(entry => {
    if (entry.meals?.breakfast) totalMeals++;
    if (entry.meals?.lunch) totalMeals++;
    if (entry.meals?.dinner) totalMeals++;
  });

  return ((totalMeals / possibleMeals) * 100).toFixed(1);
};

const calculateVitalsTrends = (history) => {
  const vitals = history
    .filter(entry => entry.vitals)
    .map(entry => entry.vitals);

  if (vitals.length === 0) return null;

  return {
    avgSugar: calculateAverage(history, 'vitals.sugar'),
    avgBpHigh: calculateAverage(history, 'vitals.bpHigh'),
    avgBpLow: calculateAverage(history, 'vitals.bpLow'),
    avgWeight: calculateAverage(history, 'vitals.weight')
  };
};
