import { model, Schema } from "mongoose";
import { TCart } from "./cart.interface";

const CartSchema = new Schema<TCart>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        items: [
            {
                productId: {
                    type: String,
                    ref: "product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                total: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        subtotal: {
            type: Number,
            default: 0,
            min: 0,
        },
        total: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

export const CartModel = model<TCart>("cart", CartSchema);
