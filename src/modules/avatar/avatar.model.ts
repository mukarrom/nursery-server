import { model, Schema } from "mongoose";
import { TAvatar } from "./avatar.interface";

const AvatarSchema = new Schema<TAvatar>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const AvatarModel = model<TAvatar>("Avatar", AvatarSchema);
