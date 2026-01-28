import { z } from "zod";

const paymentMethodZodSchema = z.object({
    body: z.object({
        methodName: z.string({ required_error: "Method name is required", invalid_type_error: "Method name must be a string" }).min(1, "Method name is required").trim(),
        description: z.string({ invalid_type_error: "Description must be a string" }).optional(),
        accountNumber: z.string({ invalid_type_error: "Account number must be a string" }).optional(),
        accountName: z.string({ invalid_type_error: "Account name must be a string" }).optional(),
        accountType: z.enum(["Personal", "Agent"], {
            errorMap: () => ({ message: "Invalid account type, allowed values are Personal, Agent" }),
        }),
        instructions: z.string({ invalid_type_error: "Instructions must be a string" }).optional(),
        isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
    }),
});

const createPaymentMethodZodSchema = paymentMethodZodSchema;
const updatePaymentMethodZodSchema = paymentMethodZodSchema.partial();

export const paymentMethodValidation = {
    createPaymentMethodZodSchema,
    updatePaymentMethodZodSchema,
};
