import { Types } from "mongoose";

export type TWishlist = {
    userId: string;
    productIds: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
};
