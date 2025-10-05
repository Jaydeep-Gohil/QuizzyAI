import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER?.trim(),
    pass: process.env.SMTP_PASS?.trim(),
  },
});
transporter
  .verify()
  .then(() => {
    console.log("SMTP connection established successfully");
  })
  .catch((err) => {
    console.error("SMTP connection error:", err);
  });
export default transporter;
