import { GoogleGenerativeAI } from "@google/generative-ai";

const bioMistralClient = new GoogleGenerativeAI(process.env.BIOMISTRAL_API_KEY);

/**
 * Analyze health trends using BioMistral AI Model
 * @param {Object} user - User document
 * @param {Array} monitoringHistory - Array of daily monitoring entries
 * @returns {Object} Health analysis with trends, recommendations, and concerns
 */
export const analyzeHealthTrends = async (user, monitoringHistory) => {
  try {
    const model = bioMistralClient.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare monitoring data summary
    const dataSummary = monitoringHistory.map((entry, index) => ({
      day: index + 1,
      date: entry.date.toISOString().split('T')[0],
      sleep: `${entry.sleep?.hours || 0}h (quality: ${entry.sleep?.quality || 0}/5)`,
      water: `${entry.water?.liters || 0}L`,
      meals: `B:${entry.meals?.breakfast ? '✓' : '✗'} L:${entry.meals?.lunch ? '✓' : '✗'} D:${entry.meals?.dinner ? '✓' : '✗'}`,
      mood: `${entry.mood?.score || 0}/5${entry.mood?.note ? ` - ${entry.mood.note}` : ''}`,
      vitals: entry.vitals ? `Sugar:${entry.vitals.sugar} BP:${entry.vitals.bpHigh}/${entry.vitals.bpLow} Weight:${entry.vitals.weight}kg` : 'N/A',
      symptoms: entry.symptoms?.note || 'None'
    }));

    const prompt = `You are a health analysis AI assistant for HealthSync, an Indian health monitoring app.

**User Profile:**
- Name: ${user.name}
- Age: ${user.age || 'N/A'}
- Gender: ${user.gender || 'N/A'}
- Height: ${user.height || 'N/A'} cm
- Weight: ${user.weight || 'N/A'} kg
- Disease Tags: ${user.diseaseTags?.join(', ') || 'None'}
- Diet Type: ${user.dietType || 'N/A'}

**Daily Monitoring Data (Last ${monitoringHistory.length} days):**
${JSON.stringify(dataSummary, null, 2)}

**Task:**
Analyze the user's health trends and provide:

1. **Summary**: Brief overview of their health status (2-3 sentences)
2. **Trends**: Key patterns observed in:
   - Sleep quality and duration
   - Hydration levels
   - Meal consistency
   - Mood patterns
   - Vital signs (sugar, BP, weight)
   - Symptoms
3. **Recommendations**: 3-5 actionable health recommendations specific to this user
4. **Concerns**: Any health concerns that need attention (if any)
5. **Diet Focus**: What should their diet focus on based on this data?

**Important:**
- Be specific and personalized
- Consider their disease tags and diet type
- Use Indian context (foods, lifestyle)
- Be encouraging but honest
- If vitals are concerning, mention it clearly

Respond in JSON format:
{
  "summary": "...",
  "trends": {
    "sleep": "...",
    "hydration": "...",
    "meals": "...",
    "mood": "...",
    "vitals": "...",
    "symptoms": "..."
  },
  "recommendations": ["...", "...", "..."],
  "concerns": ["..."],
  "dietFocus": "..."
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    return analysis;

  } catch (error) {
    console.error("Error in AI health analysis:", error);
    
    // Return fallback analysis
    return {
      summary: "Unable to generate detailed analysis at this time.",
      trends: {
        sleep: "Data recorded",
        hydration: "Data recorded",
        meals: "Data recorded",
        mood: "Data recorded",
        vitals: "Data recorded",
        symptoms: "Data recorded"
      },
      recommendations: [
        "Continue monitoring your daily health metrics",
        "Maintain consistent sleep schedule",
        "Stay hydrated throughout the day"
      ],
      concerns: [],
      dietFocus: "Balanced nutrition based on your profile"
    };
  }
};

/**
 * Get personalized chat context for user
 * @param {Object} user - User document
 * @returns {String} Context string for chat personalization
 */
export const getUserChatContext = async (user) => {
  try {
    const context = user.aiContext || {};
    
    let contextString = `User Profile: ${user.name}, Age: ${user.age || 'N/A'}, Gender: ${user.gender || 'N/A'}`;
    
    if (user.diseaseTags && user.diseaseTags.length > 0) {
      contextString += `\nHealth Conditions: ${user.diseaseTags.join(', ')}`;
    }
    
    if (user.dietType) {
      contextString += `\nDiet Preference: ${user.dietType}`;
    }
    
    if (context.healthSummary) {
      contextString += `\n\nRecent Health Status: ${context.healthSummary}`;
    }
    
    if (context.concerns && context.concerns.length > 0) {
      contextString += `\nHealth Concerns: ${context.concerns.join(', ')}`;
    }
    
    if (context.recommendations && context.recommendations.length > 0) {
      contextString += `\nActive Recommendations: ${context.recommendations.slice(0, 3).join('; ')}`;
    }
    
    return contextString;
    
  } catch (error) {
    console.error("Error getting user chat context:", error);
    return `User: ${user.name}`;
  }
};

/**
 * Generate personalized diet recommendations based on monitoring data
 * @param {Object} user - User document
 * @param {Object} monitoringData - Latest monitoring entry
 * @param {Object} healthAnalysis - Health analysis from AI model
 * @returns {Object} Diet recommendations
 */
export const generateDietRecommendations = async (user, monitoringData, healthAnalysis) => {
  try {
    const model = bioMistralClient.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a nutrition AI assistant for HealthSync, specializing in Indian cuisine.

**User Profile:**
- Name: ${user.name}
- Age: ${user.age || 'N/A'}
- Gender: ${user.gender || 'N/A'}
- Height: ${user.height || 'N/A'} cm
- Weight: ${user.weight || 'N/A'} kg
- Disease Tags: ${user.diseaseTags?.join(', ') || 'None'}
- Diet Type: ${user.dietType || 'Regular'}

**Today's Health Data:**
- Sleep: ${monitoringData.sleep?.hours || 0} hours (quality: ${monitoringData.sleep?.quality || 0}/5)
- Water: ${monitoringData.water?.liters || 0} liters
- Mood: ${monitoringData.mood?.score || 0}/5
- Vitals: Sugar ${monitoringData.vitals?.sugar || 'N/A'}, BP ${monitoringData.vitals?.bpHigh || 'N/A'}/${monitoringData.vitals?.bpLow || 'N/A'}
- Symptoms: ${monitoringData.symptoms?.note || 'None'}

**Health Analysis:**
${healthAnalysis.summary}

**Diet Focus:**
${healthAnalysis.dietFocus}

**Task:**
Generate a personalized daily diet plan with:
1. Breakfast (2-3 options)
2. Mid-morning snack
3. Lunch (2-3 options)
4. Evening snack
5. Dinner (2-3 options)

**Requirements:**
- Use Indian foods and recipes
- Consider their diet type (${user.dietType || 'Regular'})
- Address their health conditions
- Include portion sizes
- Add nutritional benefits
- Be practical and affordable

Respond in JSON format:
{
  "breakfast": [{"name": "...", "portion": "...", "benefits": "..."}],
  "midMorning": {"name": "...", "portion": "...", "benefits": "..."},
  "lunch": [{"name": "...", "portion": "...", "benefits": "..."}],
  "evening": {"name": "...", "portion": "...", "benefits": "..."},
  "dinner": [{"name": "...", "portion": "...", "benefits": "..."}],
  "hydration": "...",
  "avoidFoods": ["..."]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse diet recommendations");
    }
    
    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("Error generating diet recommendations:", error);
    return null;
  }
};
