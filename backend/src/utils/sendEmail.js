import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: `"Healthsync" <${process.env.SMTP_USER}>`,
    to,
    subject: subject || "Healthsync Reminder",
    text: text || "This is your medication reminder.",
  });
}
