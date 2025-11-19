import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  mealType: { type: String, required: true }, // Breakfast / Lunch / Dinner / Snack
  recipe: { type: String, required: true },
  calories: { type: Number, default: 0 },
  image: { type: String } // optional, URL or filename
});

const dailyMealSchema = new mongoose.Schema({
  day: { type: String, required: true }, // Monday, Tuesday, etc.
  meals: [mealSchema]
});

const dietPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekNumber: { type: Number }, // optional
  dailyMeals: [dailyMealSchema],
}, {
  timestamps: true // adds createdAt & updatedAt
});

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);

export default DietPlan;
