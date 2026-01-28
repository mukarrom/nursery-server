import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { reviewController } from "./review.controller";
import { reviewValidation } from "./review.validation";

const reviewRouter = Router();

/**
 * Create a review
 */
reviewRouter.post(
    "/",
    auth(),
    validateRequest(reviewValidation.createReviewZodSchema),
    reviewController.createReviewController
);

/**
 * Update a review
 */
reviewRouter.patch("/update/:reviewId", auth(), validateRequest(reviewValidation.updateReviewZodSchema), reviewController.updateReviewController);

/**
 * Get reviews by product
 */
reviewRouter.get("/product/:productId", reviewController.getReviewsByProductController);

/**
 * Get my reviews
 */
reviewRouter.get("/my", auth(), reviewController.getReviewsByUserController);

/**
 * Publish review
 */
reviewRouter.patch("/:reviewId/publish", auth(), reviewController.publishReviewController);

/**
 * Unpublish review
 */
reviewRouter.patch("/:reviewId/unpublish", auth(), reviewController.unpublishReviewController);

/**
 * Mark review as helpful
 */
reviewRouter.patch("/:reviewId/helpful", reviewController.addHelpfulReviewController);

/** 
 * Delete review 
 */
reviewRouter.delete("/:reviewId", auth(), reviewController.deleteReviewController);

export default reviewRouter;
