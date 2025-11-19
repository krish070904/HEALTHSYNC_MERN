import Alert from "../models/Alert.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import twilio from "twilio";
import admin from "firebase-admin";
import fs from "fs";

// Init Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(process.env.FIREBASE_ADMIN_KEY_PATH, "utf8")
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ----------------- Send Notification -----------------
export const sendNotification = async (alert) => {
  try {
    const user = await User.findById(alert.userId);
    if (!user) throw new Error("User not found for alert");

    const email = user.email;
    const phone = user.phone;
    const fcmToken = user.fcmToken;

    // Email
    if (alert.channels.includes("email") && email) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from: `"Healthsync Alerts" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Health Alert: ${alert.type}`,
        text: alert.message,
      });
    }

    // SMS
    if (alert.channels.includes("sms") && phone) {
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: alert.message,
        from: process.env.TWILIO_PHONE,
        to: phone,
      });
    }

    // Push Notification
    if (alert.channels.includes("app") && fcmToken) {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: `Health Alert: ${alert.type}`,
          body: alert.message,
        },
      });
    }

    alert.status = "sent";
    await alert.save();
  } catch (err) {
    console.error("Error sending alert:", err);
  }
};

// ----------------- Pure Helper -----------------
export const createAlertInDB = async (userId, type, severity, message, channels) => {
  const alert = await Alert.create({ userId, type, severity, message, channels });
  await sendNotification(alert);
  return alert;
};

// ----------------- Express Routes -----------------
export const createAlertManual  = async (req, res) => {
  try {
    const { userId, type, severity, message, channels } = req.body;
    const alert = await createAlertInDB(userId, type, severity, message, channels);
    res.json({ message: "Alert created and notifications sent", alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating alert" });
  }
};

export const getUserAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ alerts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching alerts" });
  }
};

export const updateAlertStatus = async (req, res) => {
  try {
    const { alertId, status } = req.body;
    const alert = await Alert.findById(alertId);
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    alert.status = status;
    await alert.save();
    res.json({ message: "Alert status updated", alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating alert status" });
  }
};
