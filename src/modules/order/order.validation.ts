import { z } from "zod";

const addressSchema = z.object({
    street: z.string().min(3, "Street is required"),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(2, "Postal code is required"),
    country: z.string().min(2, "Country is required"),
});

const orderBodySchema = z.object({
    shippingAddressId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid address ID"),
    billingAddressId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid address ID").optional(),
    paymentMethod: z.string().optional(),
    discountCode: z.string().optional(),
    notes: z.string().optional(),
});

export const createOrderZodSchema = z.object({
    body: orderBodySchema,
});

export const orderValidation = {
    createOrderZodSchema,
};
