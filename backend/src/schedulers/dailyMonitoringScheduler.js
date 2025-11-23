import cron from "node-cron";
import DailyMonitoring from "../models/DailyMonitoring.js";
import User from "../models/User.js";
import { sendEmail, sendSMS } from "../utils/notificationUtils.js";

const sendDailyMonitoringReminder = async (user, timeOfDay) => {
  const messages = {
    morning: {
      subject: "🌅 Good Morning! Time for Your Daily Health Check",
      body: `Good morning ${user.name}!\n\nIt's time to log your daily health monitoring. Please record:\n- Sleep quality\n- Water intake\n- Meals\n- Mood\n- Vitals\n- Any symptoms\n\nLog in: ${process.env.FRONTEND_URL}/daily-monitoring\n\nStay healthy! 💚`,
      sms: `Good morning ${user.name}! Time to log your daily health check. Visit ${process.env.FRONTEND_URL}/daily-monitoring`
    },
    evening: {
      subject: "⏰ Reminder: Complete Your Daily Health Check",
      body: `Hi ${user.name},\n\nWe noticed you haven't completed your daily monitoring yet.\n\nPlease log your health data before the day ends.\n\nLog in: ${process.env.FRONTEND_URL}/daily-monitoring\n\nThank you! 💙`,
      sms: `Reminder: Complete your daily health check today! Visit ${process.env.FRONTEND_URL}/daily-monitoring`
    }
  };

  const message = messages[timeOfDay];

  try {
    if (user.email) {
      await sendEmail({ userEmail: user.email, type: "reminder", message: message.body, severity: "low" });
    }
    if (user.phone) {
      await sendSMS({ userPhone: user.phone, type: "reminder", message: message.sms, severity: "low" });
    }
    console.log(`✅ ${timeOfDay} reminder sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending reminder to ${user.email}:`, error);
  }
};

const scheduleReminder = (hourUTC, timeOfDay) => {
  cron.schedule(`30 ${hourUTC} * * *`, async () => {
    try {
      const users = await User.find({ isActive: true });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      for (const user of users) {
        const todayEntry = await DailyMonitoring.findOne({
          userId: user._id,
          date: { $gte: today, $lt: tomorrow }
        });

        if (!todayEntry) await sendDailyMonitoringReminder(user, timeOfDay);
      }
    } catch (error) {
      console.error(`Error in ${timeOfDay} reminder:`, error);
    }
  });
  console.log(`✅ ${timeOfDay} reminder scheduled`);
};

export const initializeDailyMonitoringSchedulers = () => {
  scheduleReminder(3, "morning");  // 9:00 AM IST
  scheduleReminder(14, "evening"); // 8:00 PM IST
  console.log("✅ Daily Monitoring Schedulers initialized");
};
