import AppError from "../../errors/AppError";
import { ProductModel } from "../products/products.model";
import { ReviewModel } from "./review.model";

/**
 * Create Review Service
 * @param userId 
 * @param productId 
 * @param rating 
 * @param reviewText 
 * @returns 
 */
export const createReviewService = async (
    userId: string,
    productId: string,
    rating: number,
    reviewText?: string
) => {
    const product = await ProductModel.findById(productId);
    if (!product) {
        throw new AppError(404, "Product not found");
    }

    const existingReview = await ReviewModel.findOne({ userId, productId });
    if (existingReview) {
        throw new AppError(400, "You have already reviewed this product");
    }

    const review = await ReviewModel.create({
        userId,
        productId,
        rating,
        reviewText,
        isPublished: false,
    });

    return review;
};

/**
 * Update Review Service
 */
export const updateReviewService = async (
    reviewId: string,
    userId: string,
    updateData: { rating?: number; reviewText?: string }
) => {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
        throw new AppError(404, "Review not found");
    }
    if (review.userId.toString() !== userId) {
        throw new AppError(403, "You are not authorized to update this review");
    }
    if (updateData.rating !== undefined) {
        review.rating = updateData.rating;
    }
    if (updateData.reviewText !== undefined) {
        review.reviewText = updateData.reviewText;
    }
    await review.save();

    // Update product rating
    await updateProductRatingService(review.productId.toString());
    return review;
}

/**
 * Publish Review Service
 * @param reviewId 
 * @returns 
 */
export const publishReviewService = async (reviewId: string) => {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
        throw new AppError(404, "Review not found");
    }

    review.isPublished = true;
    await review.save();

    // Update product rating
    await updateProductRatingService(review.productId.toString());

    return review;
};

/**
 * Unpublish Review Service
 * @param reviewId 
 * @returns
 */
export const unpublishReviewService = async (reviewId: string) => {
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
        throw new AppError(404, "Review not found");
    }

    review.isPublished = false;
    await review.save();

    // Update product rating
    await updateProductRatingService(review.productId.toString());

    return review;
};

/**
 * Update Product Rating Service
 */
export const updateProductRatingService = async (productId: string) => {
    const reviews = await ReviewModel.find({ productId, isPublished: true });

    if (reviews.length === 0) {
        await ProductModel.updateOne(
            { _id: productId },
            { ratingAverage: 0, ratingCount: 0 }
        );
        return;
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await ProductModel.updateOne(
        { _id: productId },
        { ratingAverage: averageRating, ratingCount: reviews.length }
    );
};

/**
 * Get Reviews By Product Service
 */
export const getReviewsByProductService = async (productId: string) => {
    const reviews = await ReviewModel.find({ productId, isPublished: true })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
    return reviews;
};

/**
 * Get Reviews By User Service
 */
export const getReviewsByUserService = async (userId: string) => {
    const reviews = await ReviewModel.find({ userId })
        .populate("productId", "name")
        .sort({ createdAt: -1 });
    return reviews;
};

/**
 * Add Helpful Review Service
 */
export const addHelpfulReviewService = async (reviewId: string) => {
    const review = await ReviewModel.findByIdAndUpdate(
        reviewId,
        { $inc: { helpfulCount: 1 } },
        { new: true }
    );

    if (!review) {
        throw new AppError(404, "Review not found");
    }

    return review;
};

/**
 * Delete Review Service
 */
export const deleteReviewService = async (reviewId: string) => {
    const review = await ReviewModel.findByIdAndDelete(reviewId);
    if (!review) {
        throw new AppError(404, "Review not found");
    }

    // Update product rating
    if (review.isPublished) {
        await updateProductRatingService(review.productId.toString());
    }

    return review;
};

export const reviewServices = {
    createReviewService,
    updateReviewService,
    publishReviewService,
    unpublishReviewService,
    getReviewsByProductService,
    getReviewsByUserService,
    addHelpfulReviewService,
    deleteReviewService,
};
