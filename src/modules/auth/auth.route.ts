/**
 * Authentication routes for the Catering App API
 * @module AuthRoutes
 */

import { Router } from "express";
import { USER_ROLE } from "../../constants/status.constants";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../utils/multer";
import { authController } from "./auth.controller";
import {
  AuthValidations,
} from "./auth.validation";

const router = Router();

/**
 * @route POST /auth/sign-up
 * @group Authentication - User registration and login
 * @param {SignUpRequest.model} request.body.required - User registration data
 * @returns {SignUpResponse.model} 201 - User created successfully
 * @returns {ErrorResponse.model} 400 - Invalid input data
 * @returns {ErrorResponse.model} 409 - Email already exists
 */
router.post(
  "/sign-up",
  upload.single("profilePicture"),
  validateRequest(AuthValidations.signUpZodSchema),
  authController.signUpController
);

/**
 * @route POST /auth/login
 * @group Authentication - User registration and login
 * @param {LoginRequest.model} request.body.required - User credentials
 * @returns {LoginResponse.model} 200 - Login successful
 * @returns {ErrorResponse.model} 401 - Invalid credentials
 * @returns {ErrorResponse.model} 403 - Email not verified
 */
router.post(
  "/login",
  validateRequest(AuthValidations.loginZodSchema),
  authController.signInController
);

/**
 * @route GET /auth/refresh-token/:id
 * @group Authentication - Token management
 * @param {string} id.path.required - User ID
 * @param {string} refreshToken.query.required - Refresh token
 * @returns {TokenResponse.model} 200 - New access token generated
 * @returns {ErrorResponse.model} 401 - Invalid refresh token
 */
// router.get("/refresh-token/:id", authController.refreshTokenController);

/**
 * @route DELETE /auth/logout
 * @group Authentication - Session management
 * @security JWT
 * @returns {object} 200 - Logout successful
 * @returns {ErrorResponse.model} 401 - Unauthorized
 */
// router.delete("/logout", authController.signOutController);

/**
 * @route GET /auth/verify-email
 * @group Authentication - Email Verification
 * COMMENTED OUT: Email verification is no longer required
 */
// router.get(
//   "/verify-email",
//   authController.verifyEmailLinkController
// );

// Email verification routes
/**
 * @route POST /auth/verify-email
 * @group Authentication - Email Verification
 * COMMENTED OUT: Email verification is no longer required
 */
// router.post(
//   "/verify-email",
//   validateRequest(emailVerificationValidationSchema),
//   authController.verifyEmailController
// );

/**
 * @route POST /auth/resend-verification
 * @group Authentication - Email Verification
 * COMMENTED OUT: Email verification is no longer required
 */
// router.post(
//   "/resend-otp",
//   validateRequest(resendVerificationValidationSchema),
//   authController.resendVerificationController
// );

/**
 * @route POST /auth/change-password
 * @group Authentication - Password Management
 * @security JWT
 * @param {ChangePasswordRequest.model} request.body.required - Password change data
 * @returns {object} 200 - Password changed successfully
 * @returns {ErrorResponse.model} 400 - Invalid current password
 * @returns {ErrorResponse.model} 401 - Unauthorized
 */
router.post(
  "/change-password",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validateRequest(AuthValidations.changePasswordZodSchema),
  authController.changePasswordController
);

/** Forgot password - Check if user exists
 * @route POST /auth/forgot-password
 * @group Authentication - Password Reset
 * @param {ForgotPasswordRequest.model} request.body.required - Email or phone to check
 * @returns {object} 200 - User found, returns user data
 * @returns {ErrorResponse.model} 404 - User not found
 */
router.post(
  "/forgot-password",
  validateRequest(AuthValidations.forgotPasswordValidationSchema),
  authController.forgotPasswordController
);



/** Reset password
 * @route POST /auth/reset-password
 * @group Authentication - Password Reset
 * @param {ResetPasswordRequest.model} request.body.required - User ID and new password
 * @returns {object} 200 - Password reset successfully
 * @returns {ErrorResponse.model} 400 - Invalid password reset data
 */
router.post(
  "/reset-password",
  validateRequest(AuthValidations.resetPasswordValidationSchema),
  authController.resetPasswordController
);

export const authRoute = router;
