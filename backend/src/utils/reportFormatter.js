/**
 * Report Formatter Utility
 * Formats raw health data into structured, human-readable reports
 * Used for symptom tracking, health summaries, and medical reports
 */

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Convert numeric severity score to human-readable label with emoji
 * @param {number} score - Severity score (0-100)
 * @returns {object} Label, emoji, and color code
 */
const getSeverityInfo = (score) => {
  if (score === null || score === undefined) {
    return {
      label: "Not Provided",
      emoji: "❓",
      color: "gray",
      level: 0
    };
  }

  if (score <= 30) {
    return {
      label: "Low",
      emoji: "🟢",
      color: "green",
      level: 1,
      recommendation: "Self-care sufficient"
    };
  }

  if (score <= 70) {
    return {
      label: "Medium",
      emoji: "🟡",
      color: "yellow",
      level: 2,
      recommendation: "Consultation recommended"
    };
  }

  return {
    label: "High",
    emoji: "🔴",
    color: "red",
    level: 3,
    recommendation: "Immediate medical attention required"
  };
};

/**
 * Fix file paths for cross-platform compatibility
 * @param {string} path - File path to fix
 * @returns {string} Normalized path
 */
const normalizePath = (path) => {
  if (!path) return "";
  return path.replace(/\\/g, "/");
};

/**
 * Format date for Indian locale
 * @param {string} isoDate - ISO date string
 * @returns {string} Formatted date string
 */
const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";
  
  try {
    return new Date(isoDate).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
};

/**
 * Format date to short format (DD MMM YYYY)
 * @param {string} isoDate - ISO date string
 * @returns {string} Short formatted date
 */
const formatDateShort = (isoDate) => {
  if (!isoDate) return "N/A";
  
  try {
    return new Date(isoDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch (error) {
    return "Invalid Date";
  }
};

/**
 * Calculate BMI if not provided
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI value
 */
const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(2);
};

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {object} Category info
 */
const getBMICategory = (bmi) => {
  if (!bmi) return { category: "Unknown", emoji: "❓", color: "gray" };
  
  if (bmi < 18.5) return { category: "Underweight", emoji: "⚠️", color: "yellow" };
  if (bmi < 25) return { category: "Normal", emoji: "✅", color: "green" };
  if (bmi < 30) return { category: "Overweight", emoji: "⚠️", color: "orange" };
  return { category: "Obese", emoji: "🔴", color: "red" };
};

/**
 * Calculate age from date of birth
 * @param {string} dob - Date of birth
 * @returns {number} Age in years
 */
const calculateAge = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// ========================================
// MAIN FORMATTER FUNCTION
// ========================================

/**
 * Format raw health data into a comprehensive, readable report
 * @param {object} raw - Raw data from database
 * @returns {object} Formatted report data
 */
export const formatReportData = (raw) => {
  // Calculate BMI if not provided
  const bmi = raw.user.bmi || calculateBMI(raw.user.weight, raw.user.height);
  const bmiInfo = getBMICategory(bmi);

  return {
    // ========================================
    // PATIENT INFORMATION
    // ========================================
    user: {
      // Basic Information
      name: raw.user.name || "Unknown",
      email: raw.user.email || "Not provided",
      phone: raw.user.phone || "Not provided",
      
      // Demographics
      age: raw.user.age || calculateAge(raw.user.dateOfBirth) || "N/A",
      gender: raw.user.gender || "Not specified",
      
      // Physical Metrics
      height: raw.user.height ? `${raw.user.height} cm` : "Not provided",
      weight: raw.user.weight ? `${raw.user.weight} kg` : "Not provided",
      bmi: bmi ? parseFloat(bmi) : null,
      bmiFormatted: bmi ? `${bmi} (${bmiInfo.category})` : "Not calculated",
      bmiCategory: bmiInfo,
      
      // Medical History
      diseaseTags: raw.user.diseaseTags || [],
      diseaseTagsFormatted: (raw.user.diseaseTags || []).join(", ") || "None",
      dietType: raw.user.dietType || "Regular",
      allergies: raw.user.allergies || [],
      medications: raw.user.medications || [],
    },

    // ========================================
    // HEALTH SUMMARY
    // ========================================
    summary: {
      // Severity Metrics
      avgSeverity30: raw.summary.avgSeverity30 
        ? parseFloat(raw.summary.avgSeverity30).toFixed(2)
        : 0,
      avgSeverityInfo: getSeverityInfo(raw.summary.avgSeverity30),
      
      maxSeverity: raw.summary.maxSeverity || 0,
      maxSeverityInfo: getSeverityInfo(raw.summary.maxSeverity),
      
      // Counts
      totalEntries: raw.summary.totalEntries || 0,
      alertCount: raw.summary.alertCount || 0,
      
      // Calculated Metrics
      alertRate: raw.summary.totalEntries > 0 
        ? ((raw.summary.alertCount / raw.summary.totalEntries) * 100).toFixed(1) + "%"
        : "0%",
      
      // Report Metadata
      reportGeneratedAt: formatDate(new Date().toISOString()),
      reportPeriod: raw.summary.period || "Last 30 days",
    },

    // ========================================
    // SYMPTOM ENTRIES
    // ========================================
    entries: Array.isArray(raw.entries)
      ? raw.entries
          .map((entry, index) => {
            const severityInfo = getSeverityInfo(entry.severity);
            const condition = entry.modelResult?.predicted_condition || "Not analyzed";
            
            return {
              // Identification
              id: entry.id || entry._id,
              entryNumber: index + 1,
              
              // Dates
              rawDate: entry.date || new Date().toISOString(),
              dateFormatted: formatDate(entry.date),
              dateShort: formatDateShort(entry.date),
              
              // Symptom Details
              description: entry.description || entry.textDescription || "No description provided",
              
              // Severity
              severity: entry.severity ?? 0,
              severityInfo,
              severityFormatted: `${severityInfo.emoji} ${entry.severity ?? 0}/100 - ${severityInfo.label}`,
              
              // AI Analysis
              condition,
              conditionFormatted: `🏥 ${condition}`,
              modelResult: entry.modelResult || null,
              
              // Recommendations
              recommendations: entry.modelResult?.recommendations || {
                diet: [],
                habits: [],
                doctor: "No specific recommendations"
              },
              
              // Images
              images: (entry.images || []).map(normalizePath),
              hasImages: (entry.images || []).length > 0,
              imageCount: (entry.images || []).length,
              
              // Alert Flag
              alertFlag: entry.alertFlag || false,
              alertSent: entry.alertFlag ? "✅ Yes" : "❌ No",
            };
          })
          .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate)) // Most recent first
      : [],

    // ========================================
    // ALERTS HISTORY
    // ========================================
    alerts: Array.isArray(raw.alerts)
      ? raw.alerts
          .map((alert, index) => {
            const severityInfo = getSeverityInfo(alert.severityScore || alert.severity);
            
            return {
              // Identification
              id: alert._id || alert.id,
              alertNumber: index + 1,
              
              // Dates
              rawDate: alert.createdAt || new Date().toISOString(),
              dateFormatted: formatDate(alert.createdAt),
              dateShort: formatDateShort(alert.createdAt),
              
              // Alert Details
              type: alert.type || "symptom",
              typeFormatted: (alert.type || "symptom").toUpperCase(),
              
              // Severity
              severity: alert.severityScore ?? alert.severity ?? 0,
              severityInfo,
              severityFormatted: `${severityInfo.emoji} ${alert.severityScore ?? alert.severity ?? 0}/100 - ${severityInfo.label}`,
              
              // Description
              description: alert.textDescription || alert.message || alert.description || "No description",
              
              // Status
              status: alert.status || "pending",
              statusFormatted: alert.status === "resolved" ? "✅ Resolved" : "⏳ Pending",
              
              // Channels
              channels: alert.channels || ["app"],
              channelsFormatted: (alert.channels || ["app"]).join(", "),
            };
          })
          .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate)) // Most recent first
      : [],

    // ========================================
    // STATISTICS
    // ========================================
    statistics: {
      totalSymptoms: Array.isArray(raw.entries) ? raw.entries.length : 0,
      totalAlerts: Array.isArray(raw.alerts) ? raw.alerts.length : 0,
      lowSeverityCount: Array.isArray(raw.entries) 
        ? raw.entries.filter(e => (e.severity ?? 0) <= 30).length 
        : 0,
      mediumSeverityCount: Array.isArray(raw.entries)
        ? raw.entries.filter(e => (e.severity ?? 0) > 30 && (e.severity ?? 0) <= 70).length
        : 0,
      highSeverityCount: Array.isArray(raw.entries)
        ? raw.entries.filter(e => (e.severity ?? 0) > 70).length
        : 0,
    },
  };
};

/**
 * Generate a text-based summary of the report
 * @param {object} formattedData - Formatted report data
 * @returns {string} Text summary
 */
export const generateTextSummary = (formattedData) => {
  const { user, summary, statistics } = formattedData;
  
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HEALTHSYNC MEDICAL REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 PATIENT INFORMATION:
   Name: ${user.name}
   Age: ${user.age} | Gender: ${user.gender}
   BMI: ${user.bmiFormatted}
   Medical Conditions: ${user.diseaseTagsFormatted}
   Diet Type: ${user.dietType}

📊 HEALTH SUMMARY (${summary.reportPeriod}):
   Total Symptoms Logged: ${statistics.totalSymptoms}
   Total Alerts Triggered: ${statistics.totalAlerts}
   Average Severity: ${summary.avgSeverity30} ${summary.avgSeverityInfo.emoji}
   Maximum Severity: ${summary.maxSeverity} ${summary.maxSeverityInfo.emoji}
   Alert Rate: ${summary.alertRate}

⚡ SEVERITY BREAKDOWN:
   ${statistics.lowSeverityCount} Low 🟢 | ${statistics.mediumSeverityCount} Medium 🟡 | ${statistics.highSeverityCount} High 🔴

📅 Report Generated: ${summary.reportGeneratedAt}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
};

export default formatReportData;
