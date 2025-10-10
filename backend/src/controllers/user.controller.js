import asyncHandler from "../middlewares/async.middleware.js";
import { successResponse, errorResponse } from "../utils/responses.js";
import generateToken from "../utils/generateToken.js";
import {
  findUserByEmail,
  createUser,
  comparePassword,
  findUserById,
  findUserByIdAndGetDetails,
} from "../dao/user.dao.js";
import transporter from "../config/nodemailer.config.js";
import crypto from "crypto";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const isValidPassword = (password) =>
  password.length >= 6 && /\d/.test(password);

// Register user
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return errorResponse(res, 400, "Name, email, and password are required");
  }

  if (!isValidEmail(email)) {
    return errorResponse(res, 400, "Invalid email format");
  }

  if (!isValidPassword(password)) {
    return errorResponse(
      res,
      400,
      "Password must be at least 6 characters and contain at least one number"
    );
  }

  const userExists = await findUserByEmail(email);
  if (userExists) {
    return errorResponse(res, 400, "User already exists");
  }

  // Generate a raw token (for the URL) + store only the HASH in DB
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const user = await createUser({ name, email, password, hashedToken, role });
  const token = generateToken(user._id);
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${rawToken}`;

  res.cookie("token", token, cookieOptions);

  // Send email with the link
  await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Verify your Campus-Voice account",
    html: `
        <p>Hello ${name},</p>
        <p>Thanks for registering. Please verify your account:</p>
        <p><a href="${verifyUrl}" target="_blank">Verify My Account</a></p>
        <p>This link expires in 1 hour.</p>
      `,
  });

  return successResponse(
    res,
    201,
    {},
    "Account created. Check your email to verify your account."
  );
});

// Login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return errorResponse(res, 401, "Invalid email or password");
  }

  if (!user.isVerified)
    return errorResponse(
      res,
      403,
      "Account not verified. Please verify your email first."
    );

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return errorResponse(res, 401, "Invalid email or password");
  }

  const token = generateToken(user._id);
  res.cookie("token", token, cookieOptions);
  return successResponse(res, 200, {}, "Login successful");
});

// Logout user
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", { ...cookieOptions, maxAge: 0 });
  return successResponse(res, 200, {}, "Logged  out successfully");
});

// Get current user
export const getMe = asyncHandler(async (req, res) => {
  const user = await findUserByIdAndGetDetails(req.user._id);
  if (!user) return errorResponse(res, 404, "User not found");

  return successResponse(res, 200, user, "User retrieved successfully");
});
