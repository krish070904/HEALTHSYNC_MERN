import express from "express";
import { 
  generateDietPlan, 
  getDietPlan, 
  updateDietPlan, 
  getRecipe 
} from "../controllers/dietController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateDietPlan);
router.get("/", authMiddleware, getDietPlan);
router.put("/:id", authMiddleware, updateDietPlan);
router.get("/recipe", authMiddleware, getRecipe);

export default router;
