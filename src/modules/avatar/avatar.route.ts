/**
 * Avatar routes for the Nursery Shop API
 * @module AvatarRoutes
 */

import { Router } from "express";
import { USER_ROLE } from "../../constants/status.constants";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../utils/multer";
import { avatarController } from "./avatar.controller";
import { AvatarValidation } from "./avatar.validation";

const router = Router();

/**
 * @route POST /avatars/create
 * @group Avatar - Avatar management
 * @security JWT - Admin only
 * @param {CreateAvatarRequest.model} request.body.required - Avatar data
 * @returns {object} 201 - Avatar created successfully
 * @returns {ErrorResponse.model} 400 - Invalid input data
 * @returns {ErrorResponse.model} 401 - Unauthorized
 */
router.post(
    "/create",
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    upload.single("image"),
    validateRequest(AvatarValidation.createAvatarZodSchema),
    avatarController.createAvatar
);

/**
 * @route GET /avatars
 * @group Avatar - Avatar management
 * @returns {object} 200 - List of avatars fetched successfully
 * @returns {ErrorResponse.model} 404 - No avatars found
 */
router.get("/", avatarController.getAllAvatars);

/**
 * @route GET /avatars/:id
 * @group Avatar - Avatar management
 * @param {string} id.path.required - Avatar ID
 * @returns {object} 200 - Avatar fetched successfully
 * @returns {ErrorResponse.model} 404 - Avatar not found
 */
router.get("/:id", avatarController.getAvatarById);

/**
 * @route PATCH /avatars/:id
 * @group Avatar - Avatar management
 * @security JWT - Admin only
 * @param {string} id.path.required - Avatar ID
 * @param {UpdateAvatarRequest.model} request.body - Updated avatar data
 * @returns {object} 200 - Avatar updated successfully
 * @returns {ErrorResponse.model} 400 - Invalid input data
 * @returns {ErrorResponse.model} 401 - Unauthorized
 * @returns {ErrorResponse.model} 404 - Avatar not found
 */
router.patch(
    "/:id",
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    upload.single("image"),
    validateRequest(AvatarValidation.updateAvatarZodSchema),
    avatarController.updateAvatar
);

/**
 * @route DELETE /avatars/:id
 * @group Avatar - Avatar management
 * @security JWT - Admin only
 * @param {string} id.path.required - Avatar ID
 * @returns {object} 200 - Avatar deleted successfully
 * @returns {ErrorResponse.model} 401 - Unauthorized
 * @returns {ErrorResponse.model} 404 - Avatar not found
 */
router.delete(
    "/:id",
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    avatarController.deleteAvatar
);

export const avatarRoutes = router;
