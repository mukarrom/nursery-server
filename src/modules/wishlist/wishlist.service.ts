import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { ProductModel } from "../products/products.model";
import { WishlistModel } from "./wishlist.model";

/**
 * Add a product to the wishlist
 * @param userId - The ID of the user to add the product to
 * @param productId - The ID of the product to add to the wishlist
 * @returns The updated wishlist
 */
export const addToWishlistService = async (userId: string, productId: string) => {
    const product = await ProductModel.findById(productId);
    if (!product) {
        throw new AppError(404, "Product not found");
    }

    let wishlist = await WishlistModel.findOne({ userId });
    if (!wishlist) {
        wishlist = await WishlistModel.create({
            userId,
            productIds: [new Types.ObjectId(productId)],
        });
    } else {
        if (!wishlist.productIds.some((id) => id.toString() === productId)) {
            wishlist.productIds.push(new Types.ObjectId(productId));
        }
        await wishlist.save();
    }

    return wishlist.populate("productIds");
};

/**
 * Remove a product from the wishlist
 * @param userId - The ID of the user to remove the product from
 * @param productId - The ID of the product to remove from the wishlist
 * @returns The updated wishlist
 */
export const removeFromWishlistService = async (userId: string, productId: string) => {
    const wishlist = await WishlistModel.findOne({ userId });
    if (!wishlist) {
        throw new AppError(404, "Wishlist not found");
    }

    wishlist.productIds = wishlist.productIds.filter((id) => id.toString() !== productId);
    await wishlist.save();

    return wishlist.populate("productIds");
};

/**
 * Get the wishlist of a user
 * @param userId - The ID of the user to get the wishlist of
 * @returns The wishlist of the user
 */
export const getWishlistService = async (userId: string) => {
    const wishlist = await WishlistModel.findOne({ userId }).populate("productIds");
    if (!wishlist) {
        throw new AppError(404, "Wishlist not found");
    }
    return wishlist;
};

export const checkIfInWishlistService = async (userId: string, productId: string) => {
    const wishlist = await WishlistModel.findOne({ userId });
    if (!wishlist) {
        return false;
    }
    return wishlist.productIds.some((id) => id.toString() === productId);
};

export const clearWishlistService = async (userId: string) => {
    const wishlist = await WishlistModel.findOne({ userId });
    if (!wishlist) {
        throw new AppError(404, "Wishlist not found");
    }

    wishlist.productIds = [];
    await wishlist.save();

    return wishlist;
};

export const wishlistService = {
    addToWishlistService,
    removeFromWishlistService,
    getWishlistService,
    checkIfInWishlistService,
    clearWishlistService,
};
