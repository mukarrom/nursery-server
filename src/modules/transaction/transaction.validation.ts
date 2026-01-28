import { z } from "zod";

const createTransactionZodSchema = z.object({
    body: z.object({
        orderId: z.string().min(1, "Order ID is required"),
        paymentMethodId: z.string().min(1, "Payment method ID is required"),
        userProvidedTransactionId: z.string().min(1, "User transaction ID is required"),
    }),
});

const updateTransactionStatusZodSchema = z.object({
    body: z.object({
        transactionStatus: z.enum(["pending", "completed", "failed", "cancelled"]),
        adminNotes: z.string().optional(),
    }),
});

export const transactionValidation = {
    createTransactionZodSchema,
    updateTransactionStatusZodSchema,
};
