// /src/utils/notificationUtils.js
import nodemailer from "nodemailer";
import twilio from "twilio";

// --- EMAIL SETUP (SMTP/Nodemailer) ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (alert) => {
  try {
    await transporter.sendMail({
      from: `"Healthsync Alerts" <${process.env.SMTP_USER}>`,
      to: alert.userEmail, // You can pass user email to alert or fetch from DB
      subject: `[${alert.type.toUpperCase()}] Health Alert`,
      text: `${alert.message}\nSeverity: ${alert.severity}`,
    });
    console.log("Email sent:", alert.message);
  } catch (err) {
    console.error("Email error:", err);
  }
};

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async (alert) => {
  try {
    if (!alert.userPhone) return; // skip if no phone
    await twilioClient.messages.create({
      body: `${alert.type.toUpperCase()} Alert: ${alert.message} (Severity: ${alert.severity})`,
      from: process.env.TWILIO_PHONE,
      to: alert.userPhone,
    });
    console.log("SMS sent:", alert.message);
  } catch (err) {
    console.error("SMS error:", err);
  }
};

// --- APP PUSH NOTIFICATION (Web Push or Frontend) ---
export const sendPush = async (alert) => {
  try {
    // For simplicity, we'll just log it. You can integrate FCM or Web Push API later
    console.log("App Push Notification:", alert.message);
  } catch (err) {
    console.error("Push notification error:", err);
  }
};
