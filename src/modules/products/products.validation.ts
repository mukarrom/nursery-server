import { z } from "zod";

const productBodySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    discount: z.coerce.number().min(0).max(100).optional(),
    quantity: z.coerce.number().min(0).optional(),
    isAvailable: z.coerce.boolean().default(true),
    isFeatured: z.coerce.boolean().optional(),
    sku: z.string().optional(),
    brand: z.string().optional(),
    categoryId: z.string().optional(),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
    images: z.union([z.array(z.string().url()), z.string().url()]).optional(),
});

export const createProductZodSchema = z.object({
    body: productBodySchema,
});

export const updateProductZodSchema = z.object({
    body: productBodySchema.partial(),
});

export const productValidation = {
    createProductZodSchema,
    updateProductZodSchema,
};
