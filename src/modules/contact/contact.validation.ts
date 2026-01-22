import { z } from "zod";

const createContactZodSchema = z.object({
    body: z.object({
        label: z.string().min(1, "Label is required"),
        contactType: z.enum(["WhatsApp", "Imo", "Viber", "Telegram", "Phone", "Email"], {
            errorMap: () => ({ message: "Invalid contact type, allowed values are WhatsApp, Imo, Viber, Telegram, Phone, Email" }),
        }),
        contactValue: z.string().min(1, "Contact value is required"),
        isActive: z.boolean().optional().default(true),
        displayOrder: z.number().optional().default(0),
    }),
});

const updateContactZodSchema = z.object({
    body: z.object({
        label: z.string().min(1).optional(),
        contactType: z.enum(["WhatsApp", "Imo", "Viber", "Telegram", "Phone", "Email"]).optional(),
        contactValue: z.string().min(1).optional(),
        isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
    }),
});

export const contactValidation = {
    createContactZodSchema,
    updateContactZodSchema,
};
