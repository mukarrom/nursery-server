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


// Post hook to handle E11000 duplicate key errors
CategorySchema.post("save", function (error: any, doc: any, next: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        // Extract the field name causing the error
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        next(new Error(`A category with the ${field} "${value}" already exists.`));
    } else {
        next(error);
    }
});

// Also handle updates (findOneAndUpdate)
CategorySchema.post("findOneAndUpdate", function (error: any, doc: any, next: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        next(new Error(`The ${field} you are trying to use is already taken.`));
    } else {
        next(error);
    }
});

export const CategoryModel = model<TCategory>("category", CategorySchema);
