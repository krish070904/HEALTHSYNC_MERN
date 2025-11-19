import cron from "node-cron";
import MedSchedule from "../models/MedSchedule.js";
import User from "../models/User.js";
import Alert from "../models/MedAlert.js";
import sendEmail from "../utils/sendEmail.js";

const hasReminderBeenSent = (med, now) => {
  const todayStr = now.toDateString();
  return med.adherenceLog?.some(
    (log) => log.date.toDateString() === todayStr && log.status === "reminder_sent"
  );
};

const logReminder = async (med, userId, now) => {
  med.adherenceLog.push({ date: now, status: "reminder_sent" });
  await med.save();

  if (Alert) {
    await Alert.create({
      userId,
      medName: med.medName,
      date: now,
      status: "sent",
      channel: "email",
    });
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
          if (!user || !user.email) continue;

          await sendEmail(
            user.email,
            `Medication Reminder: ${med.medName}`,
            `Hello ${user.name},\n\nIt's time to take your medicine: ${med.medName}.\nDosage: ${med.dosage}\n\nStay healthy!`
          );

          await logReminder(med, user._id, now);

          console.log(`[${now.toLocaleString()}] Reminder sent for ${med.medName} to ${user.email}`);
        }
      }
    }
  } catch (err) {
    console.error("Error in medication scheduler:", err);
  }
});
