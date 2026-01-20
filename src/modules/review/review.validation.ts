import { z } from "zod";

const reviewBodySchema = z.object({
  productId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid product ID"),
  rating: z.coerce.number().min(1, "Rating must be between 1-5").max(5, "Rating must be between 1-5"),
  reviewText: z.string().min(10, "Review text must be at least 10 characters").optional(),
  isPublished: z.coerce.boolean().default(false),
});

export const createReviewZodSchema = z.object({
  body: reviewBodySchema,
});

export const updateReviewZodSchema = z.object({
  body: reviewBodySchema.partial(),
});

export const reviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
};
