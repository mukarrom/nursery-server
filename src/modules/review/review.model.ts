import { model, Schema } from "mongoose";
import { TReview } from "./review.interface";

const ReviewSchema = new Schema<TReview>(
    {
        userId: {
            type: String,
            required: true,
        },
        productId: {
            type: String,
            ref: "product",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        reviewText: String,
        isPublished: {
            type: Boolean,
            default: false,
        },
        helpfulCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const ReviewModel = model<TReview>("review", ReviewSchema);
