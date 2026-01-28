import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import { uploadImage } from "../../utils/imageUpload";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

/**
 * Controller to sign up a new user.
 * @param req - The request object containing user details.
 * @param res - The response object to send the result.
 */
const signUpController = catchAsync(async (req, res) => {
  const body = req.body;

  // Handle profile picture upload
  if (req.file) {
    const { url } = await uploadImage(req.file.buffer, "profile-pictures");
    body.profilePicture = url;
  }

  const result = await authServices.signUpService(body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Signup completed successfully. You can now log in with your credentials.",
    data: result,
  });
});

/**
 * Controller to sign in an existing user.
 * @param req - The request object containing user credentials.
 * @param res - The response object to send the result.
 */
const signInController = catchAsync(async (req, res) => {
  const body = req.body;
  const result = await authServices.loginService(body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Signin completed successfully",
    data: result,
  });
});





/**
 * Controller to log out the current logged-in user.
 * @param req - The request object containing user ID and access token.
 * @param res - The response object to send the result.
 */
// const signOutController = catchAsync(async (req, res) => {
//   const userId = req.params.id as string;
//   const accessToken = req.headers.authorization || "";
//   const result = await authServices.signOutService(userId, accessToken);

//   sendResponse(res, {
//     statusCode: status.NO_CONTENT,
//     success: true,
//     message: "Logout successful",
//     data: result,
//   });
// });

/**
 * Controller to refresh the token of the current logged-in user.
 * @param req - The request object containing user ID and refresh token.
 * @param res - The response object to send the result.
 */
// const refreshTokenController = catchAsync(async (req, res) => {
//   const userId = req.params.id as string;
//   const refreshToken = req.body.token;
//   const result = await authServices.refreshTokenService(userId, refreshToken);

//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: "Token refreshed successfully",
//     data: result,
//   });
// });

/**
 * Controller to verify the user's email.
 * COMMENTED OUT: Email verification is no longer required
 */
// const verifyEmailController = catchAsync(async (req, res) => {
//   const { email, otp } = req.body;

//   await authServices.verifyEmailService(email, otp);

//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: "Email verified successfully",
//     data: null,
//   });
// });

/**
 * Controller to send an OTP to the user's email.
 * COMMENTED OUT: Email verification is no longer required
 */
// const resendOtpController = catchAsync(async (req, res) => {
//   const email = req.body.email;
//   await authServices.resendOtpService(email);
//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message:
//       "An OTP has been sent to your email address and will expire in 5 minutes",
//     data: null,
//   });
// });

/**
 * Controller to verify the user's email using a link.
 * COMMENTED OUT: Email verification is no longer required
 */
// const verifyEmailLinkController = catchAsync(async (req, res) => {
//   const { token, email } = req.query;

//   try {
//     const result = await authServices.verifyEmailService(
//       email as string,
//       token as string,
//       true // isLink = true for link verification
//     );

//     // Redirect to verification page with success
//     res.redirect(
//       `/verify-email?success=true&message=${encodeURIComponent(result.message)}`
//     );
//   } catch (error: any) {
//     // Redirect to verification page with error
//     res.redirect(
//       `/verify-email?success=false&message=${encodeURIComponent(error.message)}`
//     );
//   }
// });

/**
 * Controller to resend the verification email.
 * COMMENTED OUT: Email verification is no longer required
 */
// const resendVerificationController = catchAsync(async (req, res) => {
//   const { email } = req.body;
//   const result = await authServices.resendOtpService(email);
//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: "Verification email sent successfully",
//     data: result,
//   });
// });

// ----------------------------- Verify JWT -----------------------------
/**
 * Controller to verify the access token.
 * @param req - The request object containing the access token.
 * @param res - The response object to send the result.
 */
const verifyAccessTokenController = catchAsync(async (req, res) => {
  const { token } = req.body || "";
  const result = await authServices.verifyAccessTokenService(token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Access token verified successfully",
    data: result,
  });
});

/**
 * Controller to change the user's password.
 * @param req - The request object containing user ID, old password, and new password.
 * @param res - The response object to send the result.
 */
const changePasswordController = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { oldPassword, newPassword } = req.body;

  const result = await authServices.changePasswordService(
    id,
    oldPassword,
    newPassword
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

// ------------- reset password controllers ----------------------------
/**
 * @route POST /auth/request-password-reset
 * @desc Request password reset link
 * @access Public
 */
const requestPasswordReset = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError(status.BAD_REQUEST, "Email is required");
  }

  const result = await authServices.requestPasswordResetService(email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

/**
 * @route POST /auth/reset-password
 * @desc Reset user password using token
 * @access Public
 */
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  // get email and token from params
  // const { email, token } = req.params;
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    throw new AppError(
      status.BAD_REQUEST,
      "Email, token and new password are required"
    );
  }

  const result = await authServices.resetPasswordService(
    email,
    token,
    newPassword
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const authController = {
  signUpController,
  signInController,
  // COMMENTED OUT: Email verification controllers no longer used
  // verifyEmailController,
  // resendOtpController,
  // verifyEmailLinkController,
  // resendVerificationController,
  verifyAccessTokenController,
  changePasswordController,
  requestPasswordReset,
  resetPassword,
};
