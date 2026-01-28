import { model, Schema } from "mongoose";
import { TWishlist } from "./wishlist.interface";

const WishlistSchema = new Schema<TWishlist>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        productIds: {
            type: [Schema.Types.ObjectId],
            ref: "product",
            default: [],
        },
    },
    { timestamps: true }
);

// Post hook to handle E11000 duplicate key errors
WishlistSchema.post("save", function (error: any, doc: any, next: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        // Extract the field name causing the error
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        next(new Error(`A wishlist with the ${field} "${value}" already exists.`));
    } else {
        next(error);
    }
});

// Also handle updates (findOneAndUpdate)
WishlistSchema.post("findOneAndUpdate", function (error: any, doc: any, next: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        next(new Error(`The ${field} you are trying to use is already taken.`));
    } else {
        next(error);
    }
});

export const WishlistModel = model<TWishlist>("wishlist", WishlistSchema);
