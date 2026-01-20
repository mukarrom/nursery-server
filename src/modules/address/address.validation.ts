import { z } from "zod";

const addressBodySchema = z.object({
  street: z.string().min(3, "Street is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phoneNumber: z.string().optional(),
  label: z.enum(["home", "office", "other"]).default("other"),
  isDefault: z.coerce.boolean().default(false),
});

export const createAddressZodSchema = z.object({
  body: addressBodySchema,
});

export const updateAddressZodSchema = z.object({
  body: addressBodySchema.partial(),
});

export const addressValidation = {
  createAddressZodSchema,
  updateAddressZodSchema,
};
