import { z } from "zod";

const couponBodySchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().min(0, "Discount value must be non-negative"),
  validFrom: z.string().datetime({ message: "Valid from must be a valid ISO datetime" }),
  validUntil: z.string().datetime({ message: "Valid until must be a valid ISO datetime" }),
  maxUses: z.coerce.number().optional(),
  minOrderAmount: z.coerce.number().optional(),
  isActive: z.coerce.boolean().default(true),
  description: z.string().optional(),
}).refine((data) => new Date(data.validUntil) > new Date(data.validFrom), {
  message: "Valid until must be after valid from",
  path: ["validUntil"],
});

export const createCouponZodSchema = z.object({
  body: couponBodySchema,
});

const couponBodySchemaPartial = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.coerce.number().min(0, "Discount value must be non-negative").optional(),
  validFrom: z.string().datetime({ message: "Valid from must be a valid ISO datetime" }).optional(),
  validUntil: z.string().datetime({ message: "Valid until must be a valid ISO datetime" }).optional(),
  maxUses: z.coerce.number().optional(),
  minOrderAmount: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
  description: z.string().optional(),
});

export const updateCouponZodSchema = z.object({
  body: couponBodySchemaPartial,
});

export const applyCouponZodSchema = z.object({
  body: z.object({
    code: z.string(),
    orderTotal: z.coerce.number().min(0),
  }),
});

export const couponValidation = {
  createCouponZodSchema,
  updateCouponZodSchema,
  applyCouponZodSchema,
};
