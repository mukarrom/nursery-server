import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TAvatar } from "./avatar.interface";
import { AvatarModel } from "./avatar.model";

/**
 * Create a new avatar
 * @param payload - Avatar data
 * @param imageUrl - Uploaded image URL
 * @returns Created avatar
 */
const createAvatar = async (payload: Partial<TAvatar>, imageUrl: string) => {
    payload.imageUrl = imageUrl;
    const avatar = await AvatarModel.create(payload);
    return avatar;
};

/**
 * Get all avatars with query support
 * @param query - Query parameters
 * @returns List of avatars and meta data
 */
const getAllAvatars = async (query: Record<string, unknown>) => {
    const avatarQuery = new QueryBuilder(
        AvatarModel.find({ isActive: true }),
        query
    )
        .search(["name"])
        .filter()
        .sort()
        .paginate()
        .fields();

    const avatars = await avatarQuery.modelQuery;
    const meta = await avatarQuery.countTotal();

    return { avatars, meta };
};

/**
 * Get a single avatar by ID
 * @param avatarId - Avatar ID
 * @returns Avatar details
 */
const getAvatarById = async (avatarId: string) => {
    const avatar = await AvatarModel.findById(avatarId);
    if (!avatar) {
        throw new AppError(httpStatus.NOT_FOUND, "Avatar not found");
    }
    return avatar;
};

/**
 * Update an avatar
 * @param avatarId - Avatar ID
 * @param payload - Updated avatar data
 * @param imageUrl - Optional new image URL
 * @returns Updated avatar
 */
const updateAvatar = async (
    avatarId: string,
    payload: Partial<TAvatar>,
    imageUrl?: string
) => {
    if (imageUrl) {
        payload.imageUrl = imageUrl;
    }

    const avatar = await AvatarModel.findByIdAndUpdate(avatarId, payload, {
        new: true,
        runValidators: true,
    });

    if (!avatar) {
        throw new AppError(httpStatus.NOT_FOUND, "Avatar not found");
    }

    return avatar;
};

/**
 * Delete an avatar (soft delete)
 * @param avatarId - Avatar ID
 * @returns Deleted avatar
 */
const deleteAvatar = async (avatarId: string) => {
    const avatar = await AvatarModel.findByIdAndUpdate(
        avatarId,
        { isActive: false },
        { new: true }
    );

    if (!avatar) {
        throw new AppError(httpStatus.NOT_FOUND, "Avatar not found");
    }

    return avatar;
};

export const avatarService = {
    createAvatar,
    getAllAvatars,
    getAvatarById,
    updateAvatar,
    deleteAvatar,
};
