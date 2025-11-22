import cron from "node-cron";
import DailyMonitoring from "../models/DailyMonitoring.js";
import User from "../models/User.js";
import { sendEmail, sendSMS } from "../utils/notificationUtils.js";

/**
 * Daily Monitoring Scheduler
 * - Sends reminder at 9 AM to fill daily monitoring form
 * - Sends end-of-day reminder at 8 PM if not filled
 */

// Morning Reminder - 9:00 AM IST (3:30 AM UTC)
export const scheduleMorningReminder = () => {
  cron.schedule("30 3 * * *", async () => {
    console.log("🌅 Running Morning Daily Monitoring Reminder (9 AM IST)");
    
    try {
      const users = await User.find({ isActive: true });
      
      for (const user of users) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Check if user has already filled today's form
        const todayEntry = await DailyMonitoring.findOne({
          userId: user._id,
          date: { $gte: today, $lt: tomorrow }
        });
        
        if (!todayEntry) {
          // Send reminder
          await sendDailyMonitoringReminder(user, "morning");
        }
      }
    } catch (error) {
      console.error("Error in morning reminder:", error);
    }
  });
  
  console.log("✅ Morning reminder scheduled for 9:00 AM IST");
};

// Evening Reminder - 8:00 PM IST (14:30 UTC)
export const scheduleEveningReminder = () => {
  cron.schedule("30 14 * * *", async () => {
    console.log("🌙 Running Evening Daily Monitoring Reminder (8 PM IST)");
    
    try {
      const users = await User.find({ isActive: true });
      
      for (const user of users) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Check if user has already filled today's form
        const todayEntry = await DailyMonitoring.findOne({
          userId: user._id,
          date: { $gte: today, $lt: tomorrow }
        });
        
        if (!todayEntry) {
          // Send reminder
          await sendDailyMonitoringReminder(user, "evening");
        }
      }
    } catch (error) {
      console.error("Error in evening reminder:", error);
    }
  });
  
  console.log("✅ Evening reminder scheduled for 8:00 PM IST");
};

// Helper function to send reminders
const sendDailyMonitoringReminder = async (user, timeOfDay) => {
  const messages = {
    morning: {
      subject: "🌅 Good Morning! Time for Your Daily Health Check",
      body: `Good morning ${user.name}!\n\nIt's time to log your daily health monitoring. Please take a moment to record:\n- Sleep quality\n- Water intake\n- Meals\n- Mood\n- Vitals\n- Any symptoms\n\nThis helps us provide personalized health insights and diet recommendations.\n\nLog in to HealthSync now: ${process.env.FRONTEND_URL}/daily-monitoring\n\nStay healthy! 💚`,
      sms: `Good morning ${user.name}! Time to log your daily health check. Visit ${process.env.FRONTEND_URL}/daily-monitoring`
    },
    evening: {
      subject: "⏰ Reminder: Complete Your Daily Health Check",
      body: `Hi ${user.name},\n\nWe noticed you haven't completed your daily health monitoring yet.\n\nPlease take 2 minutes to log your health data before the day ends. This helps us:\n- Track your health patterns\n- Generate personalized diet plans\n- Provide better health insights\n\nLog in now: ${process.env.FRONTEND_URL}/daily-monitoring\n\nThank you! 💙`,
      sms: `Reminder: Complete your daily health check today! Visit ${process.env.FRONTEND_URL}/daily-monitoring`
    }
  };
  
  const message = messages[timeOfDay];
  
  try {
    // Send Email
    if (user.email) {
      await sendEmail({
        userEmail: user.email,
        type: "reminder",
        message: message.body,
        severity: "low"
      });
    }
    
    // Send SMS if phone exists
    if (user.phone) {
      await sendSMS({
        userPhone: user.phone,
        type: "reminder",
        message: message.sms,
        severity: "low"
      });
    }
    
    console.log(`✅ ${timeOfDay} reminder sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending reminder to ${user.email}:`, error);
  }
};

// Initialize all schedulers
export const initializeDailyMonitoringSchedulers = () => {
  scheduleMorningReminder();
  scheduleEveningReminder();
  console.log("✅ Daily Monitoring Schedulers initialized");
};
