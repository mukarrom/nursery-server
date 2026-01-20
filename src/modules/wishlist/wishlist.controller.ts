import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  addToWishlistService,
  removeFromWishlistService,
  getWishlistService,
  checkIfInWishlistService,
  clearWishlistService,
} from "./wishlist.service";

export const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId } = req.body;

  const wishlist = await addToWishlistService(userId, productId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product added to wishlist successfully",
    data: wishlist,
  });
});

export const removeFromWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId } = req.params as { productId: string };

  const wishlist = await removeFromWishlistService(userId, productId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product removed from wishlist successfully",
    data: wishlist,
  });
});

export const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const wishlist = await getWishlistService(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Wishlist retrieved successfully",
    data: wishlist,
  });
});

export const checkIfInWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId } = req.params as { productId: string };

  const isInWishlist = await checkIfInWishlistService(userId, productId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Wishlist check completed",
    data: { isInWishlist },
  });
});

export const clearWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const wishlist = await clearWishlistService(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Wishlist cleared successfully",
    data: wishlist,
  });
});

export const wishlistController = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkIfInWishlist,
  clearWishlist,
};
