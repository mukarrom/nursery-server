import { z } from "zod";

const createAvatarZodSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: "Avatar name is required",
                invalid_type_error: "Avatar name must be a string",
            })
            .min(3, "Avatar name must be at least 3 characters")
            .max(100, "Avatar name must be at most 100 characters"),
    }),
});

const updateAvatarZodSchema = z.object({
    body: z.object({
        name: z
            .string({
                invalid_type_error: "Avatar name must be a string",
            })
            .min(3, "Avatar name must be at least 3 characters")
            .max(100, "Avatar name must be at most 100 characters")
            .optional(),
        imageUrl: z
            .string({
                invalid_type_error: "Image URL must be a string",
            })
            .url("Image URL must be a valid URL")
            .optional(),
        isActive: z
            .boolean({
                invalid_type_error: "isActive must be a boolean",
            })
            .optional(),
    }),
});

export const AvatarValidation = {
    createAvatarZodSchema,
    updateAvatarZodSchema,
};
