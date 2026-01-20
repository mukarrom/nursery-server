/**
 * User routes for the Catering App API
 * @module UserRoutes
 */

import { Router } from "express";
import { USER_ROLE } from "../../constants/status.constants";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userController } from "./users.controller";
import { UserValidation } from "./users.validation";

const router = Router();

/**
 * @route PATCH /user/update
 * @group User - User profile management
 * @security JWT
 * @param {UpdateProfileRequest.model} request.body.required - User profile data
 * @returns {object} 200 - Profile updated successfully
 * @returns {ErrorResponse.model} 400 - Invalid input data
 * @returns {ErrorResponse.model} 401 - Unauthorized
 */
router.patch(
  "/update",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER, USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.updateProfileZodSchema),
  userController.updateProfile
);

/**
 * @route GET /all-users
 * @group User - Admin can see all registered users list
 */
router.get("/all-users", auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), userController.getAllUsers);

/**
 * @route PATCH /user/update-status
 * @group User - Admin can update user status
 * @security JWT
 * @param {UpdateStatusRequest.model} request.body.required - User status data
 * @returns {object} 200 - User status updated successfully
 * @returns {ErrorResponse.model} 400 - Invalid input data
 * @returns {ErrorResponse.model} 401 - Unauthorized
 */
router.patch(
  "/update-status/:userId",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.updateStatusZodSchema),
  userController.updateStatus
);


export const userRoute = router;
