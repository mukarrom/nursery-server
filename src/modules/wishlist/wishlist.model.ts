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
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

export const WishlistModel = model<TWishlist>("wishlist", WishlistSchema);
