import DailyMonitoring from "../models/DailyMonitoring.js";

export const createDailyMonitoring = async (req, res) => {
  try {
    const userId = req.user._id;

    const entry = new DailyMonitoring({
      userId,
      date: req.body.date,
      sleep: req.body.sleep,
      water: req.body.water,
      meals: req.body.meals,
      mood: req.body.mood,
      vitals: req.body.vitals,
      symptoms: req.body.symptoms
    });

    const saved = await entry.save();

    res.status(201).json({
      message: "Daily monitoring saved successfully",
      data: saved
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
