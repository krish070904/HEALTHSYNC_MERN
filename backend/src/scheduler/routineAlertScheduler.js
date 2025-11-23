import cron from "node-cron";
import User from "../models/User.js";
import { createAlertInDB, sendNotification } from "../controllers/alertController.js";

cron.schedule("0 8 * * *", async () => {
  try {
    console.log("Running routine health checks...");

    const users = await User.find({});
    for (const user of users) {
      const alert = await createAlertInDB(
        user._id,
        "routineCheck",
        50,
        "Daily routine health check pending",
        ["email", "sms", "app"]
      );

      await sendNotification(alert);
    }

    console.log("Routine alerts sent successfully.");
  } catch (err) {
    console.error("Error in routine alert scheduler:", err);
  }
});
