/**
 * User routes for the Catering App API
 * @module UserRoutes
 */

import { Router } from "express";
import { USER_ROLE } from "../../constants/status.constants";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userController } from "./users.controller";
import { userValidation } from "./users.validation";

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
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  validateRequest(userValidation.updateProfileZodSchema),
  userController.updateProfile
);

export const userRoute = router;
