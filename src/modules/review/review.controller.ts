import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  createReviewService,
  publishReviewService,
  unpublishReviewService,
  getReviewsByProductService,
  getReviewsByUserService,
  addHelpfulReviewService,
  deleteReviewService,
} from "./review.service";

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { productId, rating, reviewText } = req.body;

  const review = await createReviewService(userId, productId, rating, reviewText);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review created successfully",
    data: review,
  });
});

export const publishReview = catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params as { reviewId: string };

  const review = await publishReviewService(reviewId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review published successfully",
    data: review,
  });
});

export const unpublishReview = catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params as { reviewId: string };

  const review = await unpublishReviewService(reviewId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review unpublished successfully",
    data: review,
  });
});

export const getReviewsByProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params as { productId: string };

  const reviews = await getReviewsByProductService(productId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews retrieved successfully",
    data: reviews,
  });
});

export const getReviewsByUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const reviews = await getReviewsByUserService(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews retrieved successfully",
    data: reviews,
  });
});

export const addHelpfulReview = catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params as { reviewId: string };

  const review = await addHelpfulReviewService(reviewId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review marked as helpful",
    data: review,
  });
});

export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params as { reviewId: string };

  const review = await deleteReviewService(reviewId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review deleted successfully",
    data: review,
  });
});

export const reviewController = {
  createReview,
  publishReview,
  unpublishReview,
  getReviewsByProduct,
  getReviewsByUser,
  addHelpfulReview,
  deleteReview,
};
