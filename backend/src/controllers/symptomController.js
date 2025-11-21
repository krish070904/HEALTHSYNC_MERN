import SymptomEntry from "../models/SymptomEntry.js";
import { createAlertInDB } from "./alertController.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(path).toString("base64"),
      mimeType,
    },
  };
}

export const addSymptomEntry = async (req, res) => {
  try {
    const { textDescription } = req.body;
    const userId = req.user._id;

    const imageParts = req.files
      ? req.files.map((file) => fileToGenerativePart(file.path, file.mimetype))
      : [];
    
    const imagePaths = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : [];

    // --- GEMINI AI CALL ---
    // User requested gemini-2.5-flash, using gemini-2.5-flash as the current valid model identifier for Flash.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert medical AI assistant. Analyze the following symptoms and images (if provided) for a medical assessment.
      
      User Symptoms: "${textDescription}"
      
      Your Task:
      1. Identify the potential condition.
      2. Assess the severity on a scale of 0 to 100. 
         - 0-30: Mild (Self-care sufficient)
         - 31-69: Moderate (Consultation recommended)
         - 70-100: Severe (Immediate medical attention required / Potential harm)
      3. Provide actionable recommendations.

      Provide the output strictly in the following JSON format:
      {
        "predicted_condition": "Name of the condition",
        "severity_score": number (0-100),
        "severity_level": "low" | "medium" | "high",
        "recommendations": {
          "diet": ["suggestion1", "suggestion2"],
          "habits": ["suggestion1", "suggestion2"],
          "doctor": "Specific advice on seeing a doctor (e.g., 'Seek immediate help', 'Schedule an appointment')"
        }
      }
      Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.
    `;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text to ensure it's valid JSON
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let aiResult;
    try {
        aiResult = JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse AI response:", text);
        aiResult = {
            predicted_condition: "Analysis Failed",
            severity_score: 0,
            severity_level: "low",
            recommendations: { diet: [], habits: [], doctor: "Please consult a doctor manually." }
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

    // --- ALERT TRIGGER ---
    // If symptoms are severe (>= 70), trigger the existing alert system (Twilio/Email/etc)
    const SEVERITY_THRESHOLD = 70;
    if (severityScore >= SEVERITY_THRESHOLD) {
      await createAlertInDB(
        userId,
        "symptom",
        severityScore,
        `CRITICAL HEALTH ALERT: Possible ${aiResult.predicted_condition} detected. Severity: ${severityScore}/100. Please seek medical attention immediately.`,
        ["email", "sms", "app"]
      );
      
      // Update the entry to reflect that an alert was sent
      savedEntry.alertFlag = true;
      await savedEntry.save();
    }

    // Return the AI result combined with the entry data
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
