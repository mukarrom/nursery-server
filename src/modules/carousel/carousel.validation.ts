import { z } from "zod";

const carouselBodySchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    description: z.string().optional(),
    isActive: z.coerce.boolean().default(true),
    order: z.coerce.number().min(0).default(0),
});

export const createCarouselZodSchema = z.object({
    body: carouselBodySchema,
});

export const updateCarouselZodSchema = z.object({
    body: carouselBodySchema.partial(),
});

export const carouselValidation = {
    createCarouselZodSchema,
    updateCarouselZodSchema,
};
