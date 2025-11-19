    import express from "express";
    import connectDB from "./src/config/db.js";
    import dotenv from "dotenv";
    import authRoutes from "./src/routes/authRoutes.js";
    import symptomRoutes from "./src/routes/symptomRoutes.js";
    import dashboardRoutes from "./src/routes/dashboardRoutes.js";
    import reportRoutes from "./src/routes/reportRoutes.js";
    import reportPdfRoutes from "./src/routes/reportPdfRoutes.js";
    import medRoutes from "./src/routes/medRoutes.js";
    import "./src/scheduler/medReminderScheduler.js";
    import chatRoutes from "./src/routes/chatRoutes.js";
    import dietRoutes from "./src/routes/dietRoutes.js";
    import alertRoutes from "./src/routes/alertRoutes.js";
    import "./src/scheduler/routineAlertScheduler.js";
    import cors from "cors";



    dotenv.config();

    const app = express();

    app.use(express.json());
    connectDB();
    app.use("/uploads", express.static("uploads"));
    app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
    }));

    app.use("/api/auth", authRoutes);
    app.use("/api/symptoms", symptomRoutes);
    app.use("/api/dashboard", dashboardRoutes);
    app.use("/api/report", reportRoutes);
    app.use("/api/report/pdf", reportPdfRoutes);
    app.use("/api/medications", medRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api/diet", dietRoutes);
    app.use("/api/alerts", alertRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    //testing git