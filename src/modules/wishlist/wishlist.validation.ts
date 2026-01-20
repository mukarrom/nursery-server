import { z } from "zod";

const wishlistBodySchema = z.object({
    productId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid product ID"),
});

export const addToWishlistZodSchema = z.object({
    body: wishlistBodySchema,
});

export const wishlistValidation = {
    addToWishlistZodSchema,
};
