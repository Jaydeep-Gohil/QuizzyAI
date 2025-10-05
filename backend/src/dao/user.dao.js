import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async ({
  name,
  email,
  password,
  hashedToken,
  role,
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken: hashedToken,
    verificationTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
    role,
  });
  return user;
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const findUserById = async (id) => {
  return await User.findById(id).select("-password");
};

export const findUserByVerificationToken = async (token) => {
  return await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });
};

export const markUserAsVerified = async (user) => {
  user.isVerified = true;
  user.verificationToken = "";
  user.verificationTokenExpires = null;
  await user.save();
  return user;
};

export const findUserByIdAndGetDetails = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) return null;
  return user.toObject();
};
