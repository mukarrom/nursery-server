import { z } from "zod";

const flashSaleBaseSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    description: z.string().optional(),
    discountType: z.enum(["percentage", "fixed"], {
        errorMap: () => ({ message: "Discount type must be 'percentage' or 'fixed'" }),
    }),
    discountValue: z.coerce.number().min(0, "Discount value must be non-negative"),
    startDate: z.string().datetime({ message: "Start date must be a valid ISO datetime" }),
    endDate: z.string().datetime({ message: "End date must be a valid ISO datetime" }),
    isActive: z.coerce.boolean().default(true),
    productIds: z.array(z.string().min(24, "Invalid product ID")).optional(),
    featured: z.coerce.boolean().default(false).optional(),
    order: z.coerce.number().min(0).default(0).optional(),
});

const flashSaleBodySchema = flashSaleBaseSchema.refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
});

const flashSaleBodySchemaPartial = flashSaleBaseSchema.partial().refine(
    (data) => {
        if (!data.startDate || !data.endDate) return true;
        return new Date(data.endDate) > new Date(data.startDate);
    },
    {
        message: "End date must be after start date",
        path: ["endDate"],
    }
);

export const createFlashSaleZodSchema = z.object({
    body: flashSaleBodySchema,
});

export const updateFlashSaleZodSchema = z.object({
    body: flashSaleBodySchemaPartial,
});

export const flashSaleValidation = {
    createFlashSaleZodSchema,
    updateFlashSaleZodSchema,
};
