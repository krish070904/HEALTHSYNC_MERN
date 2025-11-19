import express from "express";
import { addSymptomEntry, getSymptomEntriesByUser, getSymptomEntryById } from "../controllers/symptomController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";


const storage = multer.diskStorage({
    destination: (req,  file, cb) =>{
        cb(null, "uploads/");

    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + "-" + file.originalname);

    }
});

const upload = multer({storage});


const router = express.Router();


router.post("/", authMiddleware, upload.array("images", 5), addSymptomEntry);


router.get("/",authMiddleware,getSymptomEntriesByUser);

router.get("/:id" , authMiddleware, getSymptomEntryById);


export default router;