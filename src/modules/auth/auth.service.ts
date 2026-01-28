import status from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../../config";
import { USER_ROLE, USER_STATUS } from "../../constants/status.constants";
import AppError from "../../errors/AppError";
import { sendEmail } from "../../utils/emailService";
import { TUser } from "../users/users.interface";
import { UserModel } from "../users/users.model";
import { TSignUp } from "./auth.interface";
import {
  comparePasswords,
  generateToken,
  hashPassword,
  verifyAccessToken
} from "./auth.utils";
import { TLogin } from "./auth.validation";



// ------------- signup service -------------------
/**
 * Handles user signup by creating a new user.
 * Email verification OTP and sending has been disabled.
 * @param {TSignUp} payload - The signup payload containing user details (name, phone, email, password).
 * @returns {Promise<Partial<TUser>>} - The created user data.
 * @throws {AppError} - If user creation fails.
 */
const signUpService = async (payload: TSignUp) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Hash password
    const hashedPassword = await hashPassword(payload.password);

    console.log("Processing signup for:", payload.email || payload.phone);

    // COMMENTED OUT: OTP generation and email sending disabled
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const userData: Partial<TUser> = {
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      password: hashedPassword,
      role: (payload as any).role || USER_ROLE.USER,
      // COMMENTED OUT: OTP verification fields no longer populated
      // emailVerificationOtp: otp,
      // emailVerificationOtpExpires: otpExpires,
    };

    // create a new user
    console.log("Creating user with data:", JSON.stringify(userData, null, 2));
    const newUser = await UserModel.create([userData], { session });
    console.log("User created:", JSON.stringify(newUser[0].toObject(), null, 2));

    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, "Failed to create new user!");
    }

    // COMMENTED OUT: Email verification no longer sent
    // const verificationLink = `${config.clientUrl}/auth/verify-email?token=${otp}&email=${payload.email}`;
    // await sendEmail({
    //   email: payload.email,
    //   token: otp,
    //   username: payload.name,
    //   verificationLink,
    // });

    await session.commitTransaction();
    await session.endSession();

    return newUser[0].toObject({
      versionKey: false,
      transform: (doc, ret: any) => {
        delete ret.password;
        delete ret.emailVerificationOtp;
        delete ret.emailVerificationOtpExpires;
        return ret;
      },
    });
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(status.BAD_REQUEST, error.message || "Signup failed");
  }
};

// ------------- login service -------------------
/**
 * Handles user login by verifying credentials and generating access/refresh tokens.
 * @param {TLogin} payload - The login payload containing email and password.
 * @returns {Promise<TUser | null>} - The updated user data with tokens.
 * @throws {AppError} - If credentials are invalid or user is blocked/deleted.
 */
const loginService = async (payload: TLogin) => {
  const loginIdentifier = payload.email || payload.phone;
  console.log("Login attempt for:", loginIdentifier);

  // find user by email or phone and include password for comparison
  const user = await UserModel.findOne({
    $or: [
      { email: payload.email },
      { phone: payload.phone }
    ]
  }).select("+password");

  if (!user) {
    throw new AppError(status.NOT_FOUND, "This user is not found");
  }

  // check is deleted softly
  if (user.isDeleted || user.status === USER_STATUS.DELETED) {
    throw new AppError(status.FORBIDDEN, "This user has been deleted");
  }

  // check status
  if (user.status === USER_STATUS.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "This user is blocked");
  }

  // checking if password matched
  if (!(await comparePasswords(user.password, payload.password))) {
    throw new AppError(status.FORBIDDEN, "Your password is incorrect");
  }

  // check is email verified
  // Commented out: Email verification is now optional for login
  // if (!user.isEmailVerified) {
  //   throw new AppError(status.FORBIDDEN, "Your email is not verified");
  // }

  const jwtPayload = { id: (user as any)._id, email: user.email, role: user.role as string };
  // generate tokens
  const jwtAccessToken = await generateToken(jwtPayload);
  const jwtRefreshToken = await generateToken(jwtPayload, true);

  // Update user with tokens
  const updatedUser = await UserModel.findByIdAndUpdate(
    (user as any)._id,
    {
      accessToken: jwtAccessToken,
      refreshToken: jwtRefreshToken,
    },
    { new: true }
  );

  return {
    user: updatedUser,
    accessToken: jwtAccessToken,
    refreshToken: jwtRefreshToken,
  };
};

/**
 * Resend OTP for unverified email
 * @param email 
 * @returns 
 */
// ============================================================================
// COMMENTED OUT: Old resendOtp implementation - replaced with resendOtpService below
// ============================================================================
// const resendOtpService = async (email: string) => {
//   const user = await UserModel.findOne({ email });

//   if (!user) {
//     throw new AppError(status.NOT_FOUND, "This user is not found");
//   }

//   if (user.isEmailVerified) {
//     throw new AppError(status.FORBIDDEN, "Your email is already verified");
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

//   // send OTP to user
//   const verificationLink = `${config.clientUrl}/auth/verify-email?token=${otp}&email=${email}`;
//   await sendEmail({
//     email,
//     token: otp,
//     username: user.name,
//     verificationLink,
//   });

//   const updatedUser = await UserModel.findByIdAndUpdate(
//     (user as any)._id,
//     {
//       emailVerificationToken: otp,
//       emailVerificationTokenExpires: otpExpires,
//     },
//     { new: true }
//   );

//   return updatedUser;
// };

// ------------- logout service -------------------
// const signOutService = async (userId: string, token: string) => {
//   const decoded = verifyAccessToken(token) as JwtPayload;

//   if (decoded.id !== userId) {
//     throw new AppError(status.UNAUTHORIZED, "Unauthorized");
//   }

//   const updatedUser = await UserModel.findByIdAndUpdate(
//     userId,
//     {
//       accessToken: "",
//       refreshToken: "",
//     },
//     { new: true }
//   );

//   return updatedUser;
// };

// ------------- refresh token service -------------------
// const refreshTokenService = async (id: string, token: string) => {
//   const user = await UserModel.findById(id);

//   if (!user || !user.refreshToken || user.refreshToken !== token) {
//     throw new AppError(status.UNAUTHORIZED, "Refresh Token not found in database");
//   }

//   const decoded = verifyRefreshToken(token) as JwtPayload;
//   if (!decoded) {
//     throw new AppError(status.UNAUTHORIZED, "Invalid Refresh Token");
//   }

//   const accessToken = await generateToken(
//     { id: (user as any)._id, email: user.email, role: user.role as string },
//     false
//   );

//   const updatedUser = await UserModel.findByIdAndUpdate(
//     (user as any)._id,
//     { accessToken: accessToken },
//     { new: true }
//   );

//   return updatedUser;
// };

// ------------- verify email service -------------------
// COMMENTED OUT: Email verification is no longer required
// const verifyEmailService = async (
//   email: string,
//   providedOtp: string,
//   isLink: boolean = false
// ) => {
//   const trimmedOtp = providedOtp.trim();
//   const user = await UserModel.findOne({ email });

//   if (!user) {
//     throw new AppError(status.NOT_FOUND, "User not found");
//   }

//   if (user.isEmailVerified) {
//     throw new AppError(status.BAD_REQUEST, "Email already verified");
//   }

//   if (!user.emailVerificationOtp) {
//     throw new AppError(status.BAD_REQUEST, "No verification OTP found");
//   }

//   const isTokenValid = user.emailVerificationOtp === trimmedOtp;
//   const isTokenNotExpired =
//     user.emailVerificationOtpExpires &&
//     user.emailVerificationOtpExpires > new Date();

//   if (!isTokenValid) {
//     throw new AppError(status.UNAUTHORIZED, "Invalid verification code");
//   }

//   if (!isTokenNotExpired) {
//     throw new AppError(status.UNAUTHORIZED, "Verification code has expired");
//   }

//   user.isEmailVerified = true;
//   user.emailVerificationOtp = undefined;
//   user.emailVerificationOtpExpires = undefined;

//   if (isLink) {
//     const jwtPayload = { id: (user as any)._id, email: user.email, role: user.role as string };
//     const accessToken = await generateToken(jwtPayload);
//     const refreshToken = await generateToken(jwtPayload, true);

//     user.accessToken = accessToken;
//     user.refreshToken = refreshToken;
//   }

//   await user.save();

//   return {
//     message: "✅ Email verified successfully",
//     accessToken: user.accessToken,
//     refreshToken: user.refreshToken,
//   };
// };

/**
 * Resend OTP for unverified email
 * COMMENTED OUT: Email verification is no longer required
 * @param email 
 * @returns 
 */
// const resendOtpService = async (email: string) => {
//   const user = await UserModel.findOne({ email });

//   if (!user) {
//     throw new AppError(status.NOT_FOUND, "User not found");
//   }

//   if (user.isEmailVerified) {
//     throw new AppError(status.BAD_REQUEST, "Email already verified");
//   }

//   const otpToken = Math.floor(100000 + Math.random() * 900000).toString();
//   const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

//   user.emailVerificationOtp = otpToken;
//   user.emailVerificationOtpExpires = otpExpiration;
//   await user.save();

//   const verificationLink = `${config.clientUrl}/auth/verify-email?token=${otpToken}&email=${email}`;
//   await sendEmail({
//     email,
//     token: otpToken,
//     username: user.name,
//     verificationLink,
//   });

//   return {
//     message: "Verification email sent successfully",
//     email: user.email,
//   };
// };

// ============================================================================
// COMMENTED OUT: Alternative forgot password implementation using OTP
// This was replaced with token-based reset (requestPasswordResetService)
// ============================================================================
// /**
//  * Send OTP if forgot password.
//  * @param email 
//  * @returns 
//  */
// const forgotPasswordService = async (email: string) => {
//   const user = await UserModel.findOne({ email });

//   if (!user) {
//     throw new AppError(status.NOT_FOUND, "User not found");
//   }
//   if (user.isDeleted || user.status === USER_STATUS.DELETED) {
//     throw new AppError(status.FORBIDDEN, "This user has been deleted");
//   }
//   const otpToken = Math.floor(100000 + Math.random() * 900000).toString();
//   const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

//   await UserModel.findByIdAndUpdate(
//     (user as any)._id,
//     {
//       passwordResetOtp: otpToken,
//       passwordResetOtpExpires: otpExpiration,
//     },
//     { new: true }
//   );

//   const resetLink = `${config.clientUrl}/auth/reset-password?token=${otpToken}&email=${email}`;
//   await sendEmail({
//     email,
//     token: otpToken,
//     username: user.name,
//     verificationLink: resetLink,
//   });

//   return {
//     message: "If an account exists with this email, a reset link has been sent",
//   };
// };


// ------------------ verify JWT ----------------------------
const verifyAccessTokenService = (token: string) => {
  try {
    const decoded = verifyAccessToken(token) as JwtPayload;
    if (!decoded) {
      throw new AppError(status.UNAUTHORIZED, "Invalid access token");
    }
    return decoded;
  } catch (error: any) {
    throw new AppError(status.UNAUTHORIZED, error.message);
  }
};

// ------------- change password service -------------------
const changePasswordService = async (
  userId: string,
  oldPass: string,
  newPass: string
) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (!(await comparePasswords(user.password, oldPass))) {
    throw new AppError(status.FORBIDDEN, "Incorrect old password");
  }

  user.password = await hashPassword(newPass);
  user.passwordChangedAt = new Date();
  await user.save();

  return { message: "Password changed successfully" };
};

// ------------- Request reset password service ----------------------------
const requestPasswordResetService = async (email: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return {
      message: "If an account exists with this email, a reset link has been sent",
    };
  }

  const resetToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  user.passwordResetToken = resetToken;
  user.passwordResetTokenExpires = resetTokenExpires;
  await user.save();

  const resetLink = `${config.clientUrl}/auth/reset-password?token=${resetToken}&email=${email}`;
  await sendEmail({
    email,
    token: resetToken,
    username: user.name,
    verificationLink: resetLink,
  });

  return {
    message: "If an account exists with this email, a reset link has been sent",
  };
};

// ------------- Reset password service ----------------------------
const resetPasswordService = async (
  email: string,
  token: string,
  newPassword: string
) => {
  const user = await UserModel.findOne({
    email,
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError(status.BAD_REQUEST, "Invalid or expired reset token");
  }

  user.password = await hashPassword(newPassword);
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = new Date();
  await user.save();

  return { message: "Password reset successfully" };
};

export const authServices = {
  signUpService,
  loginService,
  // COMMENTED OUT: Email verification services no longer used
  // verifyEmailService,
  // resendOtpService,
  verifyAccessTokenService,
  changePasswordService,
  requestPasswordResetService,
  resetPasswordService,
};
