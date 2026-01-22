import { z } from "zod";

const orderBodySchema = z.object({
    shippingAddressId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid address ID"),
    billingAddressId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid address ID").optional(),
    selectedProductIds: z.array(z.string().regex(/^[0-9a-f]{24}$/i, "Invalid product ID")).min(1, "At least one product must be selected"),
    paymentMethod: z.string().optional(),
    discountCode: z.string().optional(),
    notes: z.string().optional(),
});

export const createOrderZodSchema = z.object({
    body: orderBodySchema,
});

const updateOrderStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"], {
            errorMap: () => ({ message: "Invalid order status" }),
        }),
    }),
});

export const orderValidation = {
    createOrderZodSchema,
    updateOrderStatusValidationSchema,
};
