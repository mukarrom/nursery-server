import AppError from "../../errors/AppError";
import { ProductModel } from "../products/products.model";
import { WishlistModel } from "./wishlist.model";

export const addToWishlistService = async (userId: string, productId: string) => {
    const product = await ProductModel.findById(productId);
    if (!product) {
        throw new AppError(404, "Product not found");
    }

    let wishlist = await WishlistModel.findOne({ userId });
    if (!wishlist) {
        wishlist = await WishlistModel.create({ userId, productIds: [productId] });
    } else {
        if (!wishlist.productIds.includes(productId)) {
            wishlist.productIds.push(productId);
        }
        await wishlist.save();
    }

    return wishlist.populate("productIds");
};

export const removeFromWishlistService = async (userId: string, productId: string) => {
    const wishlist = await WishlistModel.findOne({ userId });
    if (!wishlist) {
        throw new AppError(404, "Wishlist not found");
    }

    wishlist.productIds = wishlist.productIds.filter((id) => id.toString() !== productId);
    await wishlist.save();

    return wishlist.populate("productIds");
};

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
