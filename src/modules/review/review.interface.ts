import { Types } from "mongoose";

export type TReview = {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    rating: number;
    reviewText?: string;
    isPublished: boolean;
    helpfulCount?: number;
    createdAt: Date;
    updatedAt: Date;
};
