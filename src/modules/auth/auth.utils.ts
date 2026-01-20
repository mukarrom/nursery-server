import argon2 from "argon2";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../../config";

export type TPayload = {
  id: mongoose.ObjectId;
  email: string;
  role: string;
};

export const generateToken = async (
  payload: TPayload,
  isRefresh: boolean = false
) => {
  const numberOfDay = isRefresh
    ? parseFloat(config.jwtRefreshExpiresIn as string)
    : parseFloat(config.jwtAccessExpiresIn as string);

  return jwt.sign(payload, config.jwtAccessSecret as string, {
    expiresIn: `${numberOfDay}d`,
  });
};

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    throw new Error("Error hashing the password");
  }
};

export const comparePasswords = async (
  hashedPassword: string,
  plainTextPassword: string
): Promise<boolean> => {
  try {
    // console.log("Plain text password:", plainTextPassword);
    // console.log("Hashed password:", hashedPassword);
    if (!hashedPassword || !plainTextPassword) {
      throw new Error("Password values cannot be empty");
    }
    const result = await argon2.verify(hashedPassword, plainTextPassword);
    console.log("Password comparison result:", result);
    return result;
  } catch (err) {
    console.error("Error comparing passwords:", err);
    throw new Error("Invalid password");
  }
};

export const verifyAccessToken = (token: string) => {
  const decoded = jwt.verify(token, config.jwtAccessSecret as string);
  return decoded;
};

export const verifyRefreshToken = (token: string) => {
  const decoded = jwt.verify(token, config.jwtRefreshSecret as string);
  return decoded;
};

// -------------------------- send verification email ------------------------------------
// Moved to /utils/emailService.ts
