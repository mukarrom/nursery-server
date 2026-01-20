import { z } from "zod";

const cartItemSchema = z.object({
    productId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid product ID"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

const cartBodySchema = z.object({
    items: z.array(cartItemSchema),
});

export const createCartZodSchema = z.object({
    body: cartBodySchema,
});

export const updateCartZodSchema = z.object({
    body: z.object({
        productId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid product ID"),
        quantity: z.coerce.number().min(1),
    }),
});

export const cartValidation = {
    createCartZodSchema,
    updateCartZodSchema,
};
