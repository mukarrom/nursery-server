import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
    addHelpfulReviewService,
    createReviewService,
    deleteReviewService,
    getReviewsByProductService,
    getReviewsByUserService,
    publishReviewService,
    reviewServices,
    unpublishReviewService,
} from "./review.service";

/**
 * Create Review Controller
 */
export const createReviewController = catchAsync(async (req: Request, res: Response) => {
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

/**
 * update Review Controller
 */
const updateReviewController = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params as { reviewId: string };
    const userId = req.user?.id;
    const { rating, reviewText } = req.body;
    const review = await reviewServices.updateReviewService(
        reviewId,
        userId,
        { rating, reviewText }
    );
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Review updated successfully",
        data: review,
    });
});

/**
 * Publish Review Controller
 */
export const publishReviewController = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params;

    const review = await publishReviewService(reviewId as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Review published successfully",
        data: review,
    });
});

export const unpublishReviewController = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params as { reviewId: string };

    const review = await unpublishReviewService(reviewId as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Review unpublished successfully",
        data: review,
    });
});

export const getReviewsByProductController = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params as { productId: string };

    const reviews = await getReviewsByProductService(productId as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Reviews retrieved successfully",
        data: reviews,
    });
});

export const getReviewsByUserController = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const reviews = await getReviewsByUserService(userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Reviews retrieved successfully",
        data: reviews,
    });
});

export const addHelpfulReviewController = catchAsync(async (req: Request, res: Response) => {
    const { reviewId } = req.params as { reviewId: string };

    const review = await addHelpfulReviewService(reviewId as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Review marked as helpful",
        data: review,
    });
});

export const deleteReviewController = catchAsync(async (req: Request, res: Response) => {
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
    createReviewController,
    updateReviewController,
    publishReviewController,
    unpublishReviewController,
    getReviewsByProductController,
    getReviewsByUserController,
    addHelpfulReviewController,
    deleteReviewController,
};
