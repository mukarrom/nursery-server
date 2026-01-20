import { z } from "zod";

const categoryBodySchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    description: z.string().optional(),
});

export const createCategoryZodSchema = z.object({
    body: categoryBodySchema,
});

export const updateCategoryZodSchema = z.object({
    body: categoryBodySchema.partial(),
});

export const categoryValidation = {
    createCategoryZodSchema,
    updateCategoryZodSchema,
};
