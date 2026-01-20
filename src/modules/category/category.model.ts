import { model, Schema } from "mongoose";
import { TCategory } from "./category.interface";

const CategorySchema = new Schema<TCategory>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const CategoryModel = model<TCategory>("category", CategorySchema);
