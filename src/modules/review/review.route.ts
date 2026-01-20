import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { reviewController } from "./review.controller";
import { reviewValidation } from "./review.validation";

const reviewRouter = Router();

// Create review
reviewRouter.post(
    "/",
    auth(),
    validateRequest(reviewValidation.createReviewZodSchema),
    reviewController.createReview
);

// Get reviews by product
reviewRouter.get("/product/:productId", reviewController.getReviewsByProduct);

// Get user's reviews
reviewRouter.get("/", auth(), reviewController.getReviewsByUser);

// Publish review
reviewRouter.patch("/:reviewId/publish", auth(), reviewController.publishReview);

// Unpublish review
reviewRouter.patch("/:reviewId/unpublish", auth(), reviewController.unpublishReview);

// Mark review as helpful
reviewRouter.patch("/:reviewId/helpful", reviewController.addHelpfulReview);

// Delete review
reviewRouter.delete("/:reviewId", auth(), reviewController.deleteReview);

export default reviewRouter;
