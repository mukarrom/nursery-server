import { z } from "zod";

const userValidationSchema = z.object({
  name: z.string().min(3).max(255),
  phone: z.string().min(11).max(11).optional(),
  email: z.string().email().min(6).max(255),
});

const createUserValidationSchema = z.object({
  body: userValidationSchema,
});

const updateUserValidationSchema = z.object({
  body: userValidationSchema.partial(),
  params: z.object({ id: z.string() }),
});

const updateProfileZodSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const userValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};

export const userValidation = {
  updateProfileZodSchema,
};
