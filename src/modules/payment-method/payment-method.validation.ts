import { z } from "zod";

const createPaymentMethodZodSchema = z.object({
    body: z.object({
        methodName: z.string().min(1, "Method name is required").trim(),
        description: z.string().optional(),
        accountNumber: z.string().optional(),
        isActive: z.boolean().optional().default(true),
        displayOrder: z.number().optional().default(0),
    }),
});

const updatePaymentMethodZodSchema = z.object({
    body: z.object({
        methodName: z.string().min(1, "Method name is required").trim().optional(),
        description: z.string().optional(),
        accountNumber: z.string().optional(),
        isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
    }),
});

export const paymentMethodValidation = {
    createPaymentMethodZodSchema,
    updatePaymentMethodZodSchema,
};
