import { model, Schema } from "mongoose";
import { TContact } from "./contact.interface";

const ContactSchema = new Schema<TContact>(
    {
        label: {
            type: String,
            required: true,
            trim: true,
        },
        contactType: {
            type: String,
            enum: ["WhatsApp", "Imo", "Viber", "Telegram", "Phone", "Email"],
            required: true,
        },
        contactValue: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Post hook to handle E11000 duplicate key errors
ContactSchema.post("save", function (error: any, doc: any, next: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        next(new Error(`${field} "${value}" already exists`));
    } else {
        next(error);
    }
});

ContactSchema.post("findOneAndUpdate", function (error: any, doc: any, next: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        next(new Error(`${field} "${value}" already exists`));
    } else {
        next(error);
    }
});

export const ContactModel = model<TContact>("Contact", ContactSchema);
