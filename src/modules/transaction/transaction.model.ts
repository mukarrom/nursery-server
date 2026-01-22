import { model, Schema } from "mongoose";
import { TTransaction } from "./transaction.interface";

const TransactionSchema = new Schema<TTransaction>(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        orderId: {
            type: String,
            required: true,
            ref: "order",
        },
        userId: {
            type: String,
            required: true,
            ref: "user",
        },
        paymentMethodId: {
            type: String,
            required: true,
            ref: "paymentMethod",
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        transactionStatus: {
            type: String,
            enum: ["pending", "completed", "failed", "cancelled"],
            default: "pending",
        },
        userProvidedTransactionId: {
            type: String,
            required: true,
            trim: true,
        },
        adminNotes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

// Index for faster queries
TransactionSchema.index({ orderId: 1 });
TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ transactionStatus: 1 });
TransactionSchema.index({ createdAt: -1 });

// Post hook to handle E11000 duplicate key errors
TransactionSchema.post("save", function (error: any, doc: any, next: any) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];
        next(new Error(`A transaction with the ${field} "${value}" already exists.`));
    } else {
        next(error);
    }
});

export const TransactionModel = model<TTransaction>("transaction", TransactionSchema);
