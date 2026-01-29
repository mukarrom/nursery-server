import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { uploadImage } from "../../utils/imageUpload";
import sendResponse from "../../utils/sendResponse";
import { avatarService } from "./avatar.service";

/**
 * Controller to create a new avatar (Admin only)
 * @param req - The request object containing avatar data
 * @param res - The response object to send the result
 */
const createAvatar = catchAsync(async (req: Request, res: Response) => {
    const body = req.body;

    // Handle avatar image upload
    if (!req.file) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Avatar image is required",
            data: null,
        });
    }

    const { url } = await uploadImage(req.file.buffer, "avatars");
    const result = await avatarService.createAvatar(body, url);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Avatar created successfully",
        data: result,
    });
});

/**
 * Controller to get all avatars
 * @param req - The request object
 * @param res - The response object to send the result
 */
const getAllAvatars = catchAsync(async (req: Request, res: Response) => {
    const result = await avatarService.getAllAvatars(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Avatars fetched successfully",
        data: result.avatars,
        meta: result.meta,
    });
});

/**
 * Controller to get a single avatar by ID
 * @param req - The request object containing avatar ID
 * @param res - The response object to send the result
 */
const getAvatarById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await avatarService.getAvatarById(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Avatar fetched successfully",
        data: result,
    });
});

/**
 * Controller to update an avatar (Admin only)
 * @param req - The request object containing avatar ID and updated data
 * @param res - The response object to send the result
 */
const updateAvatar = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body;

    // Handle avatar image upload if provided
    let imageUrl: string | undefined;
    if (req.file) {
        const uploadResult = await uploadImage(req.file.buffer, "avatars");
        imageUrl = uploadResult.url;
    }

    const result = await avatarService.updateAvatar(id as string, body, imageUrl);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Avatar updated successfully",
        data: result,
    });
});

/**
 * Controller to delete an avatar (Admin only)
 * @param req - The request object containing avatar ID
 * @param res - The response object to send the result
 */
const deleteAvatar = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await avatarService.deleteAvatar(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Avatar deleted successfully",
        data: result,
    });
});

export const avatarController = {
    createAvatar,
    getAllAvatars,
    getAvatarById,
    updateAvatar,
    deleteAvatar,
};
