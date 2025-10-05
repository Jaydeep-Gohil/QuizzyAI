import asyncHandler from "../middlewares/async.middleware.js";
import { successResponse, errorResponse } from "../utils/responses.js";
import generateToken from "../utils/generateToken.js";
import {
  findUserByVerificationToken,
  markUserAsVerified,
  findUserByEmail,
} from "../dao/user.dao.js";
import transporter from "../config/nodemailer.config.js";
import crypto from "crypto";

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const verifyAccount = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await findUserByVerificationToken(token);

  if (!user) {
    return errorResponse(res, 400, "Invalid or expired verification link.");
  }

  await markUserAsVerified(user);

  const jwt = generateToken(user._id);

  res.cookie("token", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return successResponse(res, 200, {}, "Account verified successfully!");
});

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !isValidEmail(email))
    return errorResponse(res, 400, "Valid email is required");

  const user = await findUserByEmail(email);
  if (!user) return errorResponse(res, 404, "User not found");

  if (user.isVerified)
    return errorResponse(res, 400, "Account is already verified");

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  user.verificationToken = hashedToken;
  user.verificationTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  const verifyUrl = `${process.env.CLIENT_URL}/verify/${rawToken}`;

  await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "New Verification Email",
    html: `
      <p>Hello ${user.name},</p>
      <p>Click below to verify your account:</p>
      <a href="${verifyUrl}" target="_blank">Verify My Account</a>
      <p>This link expires in 1 hour.</p>
    `,
  });

  return successResponse(res, 200, {}, "New verification link sent.");
});
