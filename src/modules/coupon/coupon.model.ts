import { model, Schema } from "mongoose";
import { TCoupon } from "./coupon.interface";

const CouponSchema = new Schema<TCoupon>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
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
        validFrom: {
            type: Date,
            required: true,
        },
        validUntil: {
            type: Date,
            required: true,
        },
        maxUses: Number,
        currentUses: {
            type: Number,
            default: 0,
            min: 0,
        },
        minOrderAmount: {
            type: Number,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        description: String,
    },
    { timestamps: true }
);

export const CouponModel = model<TCoupon>("coupon", CouponSchema);
