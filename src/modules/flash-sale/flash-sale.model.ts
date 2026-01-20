import { model, Schema } from "mongoose";
import { TFlashSale } from "./flash-sale.interface";

const FlashSaleSchema = new Schema<TFlashSale>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
            required: true,
        },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        productIds: {
            type: [Schema.Types.ObjectId],
            ref: "product",
            default: [],
        },
        featured: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const FlashSaleModel = model<TFlashSale>("flash-sale", FlashSaleSchema);
