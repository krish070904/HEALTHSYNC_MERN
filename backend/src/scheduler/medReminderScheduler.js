import cron from "node-cron";
import MedSchedule from "../models/MedSchedule.js";
import User from "../models/User.js";
import MedAlert from "../models/MedAlert.js";
import { createAlertInDB } from "../controllers/alertController.js";

const hasReminderBeenSent = (med, now) => {
  const todayStr = now.toDateString();
  return med.adherenceLog?.some(
    (log) => log.date.toDateString() === todayStr && log.status === "taken"
  );
};

const logMedAlert = async (med, userId, now) => {
  try {
    await MedAlert.create({
      userId,
      medName: med.medName,
      date: now,
      status: "sent",
      channel: "email,sms,app",
    });
  } catch (err) {
    console.error("Error logging MedAlert:", err);
  }
};

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const timeNow = now.toTimeString().slice(0, 5);

    const meds = await MedSchedule.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    for (const med of meds) {
      if (med.times.includes(timeNow)) {
        if (!hasReminderBeenSent(med, now)) {
          const user = await User.findById(med.userId);
          if (!user || !user.email) {
            console.log(`User not found or missing email for med: ${med.medName}`);
            continue;
          }

          // Use the centralized alert system
          try {
            await createAlertInDB(
              user._id,
              "medication",
              50,
              `Time to take your medicine: ${med.medName}. Dosage: ${med.dosage}`,
              ["email", "sms", "app"]
            );

            // Log to MedAlert for tracking
            await logMedAlert(med, user._id, now);

            console.log(`[${now.toLocaleString()}] Reminder sent for ${med.medName} to ${user.email}`);
          } catch (alertErr) {
            console.error(`Error sending alert for ${med.medName}:`, alertErr);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error in medication scheduler:", err);
  }
});
