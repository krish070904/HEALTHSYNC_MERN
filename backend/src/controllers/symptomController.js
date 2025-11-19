import SymptomEntry from "../models/SymptomEntry.js";
import { createAlertInDB } from "./alertController.js";

export const addSymptomEntry = async (req, res) => {
  try {
    const { textDescription, severityScore = 0 } = req.body;
    const userId = req.user._id;

    const images = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : [];

    const newEntry = new SymptomEntry({
      userId,
      textDescription,
      images,
      modelResults: {},
      severityScore,
      alertFlag: false,
    });

    const savedEntry = await newEntry.save();

    // --- ALERT TRIGGER ---
    const SEVERITY_THRESHOLD = 70;
    if (severityScore >= SEVERITY_THRESHOLD) {
      // Use the helper directly
      await createAlertInDB(
        userId,
        "symptom",
        severityScore,
        `High severity detected: ${textDescription}`,
        ["email", "sms", "app"]
      );
    }

    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSymptomEntriesByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    let query = SymptomEntry.find({ userId });

    if (req.query.minSeverity) {
      query = query.where("severityScore").gte(Number(req.query.minSeverity));
    }

    const entries = await query.sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSymptomEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await SymptomEntry.findById(id);

    if (!entry) return res.status(404).json({ message: "Entry not found" });

    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
