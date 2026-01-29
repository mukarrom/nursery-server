import { z } from "zod";
import { USER_STATUS } from "../../constants/status.constants";

const userValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(3, "Name must be at least 3 characters")
      .max(255),
    emailOrPhone: z
      .string({
        required_error: "Email or phone is required",
        invalid_type_error: "Email or phone must be a string",
      })
      .refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\d{11}$/.test(val),
        { message: "Must be a valid email or 11-digit phone number" }
      )
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(255)
      .optional(),
    profilePicture: z
      .string()
      .optional(),
    avatarId: z
      .string()
      .optional(),
    role: z
      .enum(["USER", "ADMIN", "SUPER_ADMIN"], {
        invalid_type_error: "Role must be a valid role",
      })
      .optional(),
  }),
});

const updateProfileZodSchema = z.object({
  body: userValidationSchema.partial(),
});

const updateStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(USER_STATUS) as [string, ...string[]], {
      invalid_type_error: "Status must be a valid status",
    }),
  }),
});

export const UserValidation = {
  updateProfileZodSchema,
  updateStatusZodSchema,
};
