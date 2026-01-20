import { model, Schema } from "mongoose";
import { TProduct } from "./products.interface";

const ProductSchema = new Schema<TProduct>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        sku: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        discount: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        quantity: {
            type: Number,
            min: 0,
            default: 0,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        brand: {
            type: String,
            trim: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "category",
        },
        tags: {
            type: [String],
            default: [],
        },
        ratingAverage: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        ratingCount: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    { timestamps: true }
);

export const ProductModel = model<TProduct>("product", ProductSchema);
