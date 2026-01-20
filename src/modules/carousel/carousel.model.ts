import { model, Schema } from "mongoose";
import { TCarousel } from "./carousel.interface";

const CarouselSchema = new Schema<TCarousel>(
    {
        image: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

export const CarouselModel = model<TCarousel>("carousel", CarouselSchema);
