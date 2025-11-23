import SymptomEntry from "../models/SymptomEntry.js";
import { createAlertInDB } from "./alertController.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const bioMistralClient = new GoogleGenerativeAI(process.env.BIOMISTRAL_API_KEY);

const fileToGenerativePart = (filePath, mimeType) => ({
  inlineData: {
    data: fs.readFileSync(filePath).toString("base64"),
    mimeType,
  },
});

export const addSymptomEntry = async (req, res) => {
  try {
    const { textDescription } = req.body;
    const userId = req.user._id;

    const imageParts = req.files?.map(f => fileToGenerativePart(f.path, f.mimetype)) || [];
    const imagePaths = req.files?.map(f => f.path.replace(/\\/g, "/")) || [];

    const model = bioMistralClient.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert medical AI assistant. Analyze the following symptoms and images for a medical assessment.
      User Symptoms: "${textDescription}"

      Your Task:
      1. Identify the potential condition.
      2. Assess severity (0-100): 0-30 low, 31-69 medium, 70-100 high.
      3. Provide actionable recommendations.

      Output JSON only:
      {
        "predicted_condition": "Condition Name",
        "severity_score": number,
        "severity_level": "low" | "medium" | "high",
        "recommendations": {
          "diet": ["suggestion1"],
          "habits": ["suggestion1"],
          "doctor": "Advice on seeing a doctor"
        }
      }
    `;

    const result = await model.generateContent([prompt, ...imageParts]);
    const text = (await result.response).text().replace(/```json|```/g, "").trim();

    let aiResult;
    try {
      aiResult = JSON.parse(text);
    } catch {
      aiResult = {
        predicted_condition: "Analysis Failed",
        severity_score: 0,
        severity_level: "low",
        recommendations: { diet: [], habits: [], doctor: "Consult a doctor manually." },
      };
    }

    const severityScore = aiResult.severity_score || 0;

    const newEntry = new SymptomEntry({
      userId,
      textDescription,
      images: imagePaths,
      modelResult: aiResult,
      severityScore,
      alertFlag: false,
    });

    const savedEntry = await newEntry.save();

    if (severityScore >= 70) {
      await createAlertInDB(
        userId,
        "symptom",
        severityScore,
        `CRITICAL HEALTH ALERT: Possible ${aiResult.predicted_condition}. Severity: ${severityScore}/100.`,
        ["email", "sms", "app"]
      );
      savedEntry.alertFlag = true;
      await savedEntry.save();
    }

    res.status(201).json({ ...savedEntry.toObject(), ...aiResult });
  } catch (err) {
    console.error("Error in addSymptomEntry:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getSymptomEntriesByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    let query = SymptomEntry.find({ userId });

    if (req.query.minSeverity) query = query.where("severityScore").gte(Number(req.query.minSeverity));

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
