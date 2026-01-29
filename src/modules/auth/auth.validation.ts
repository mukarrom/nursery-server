import { z } from "zod";
import { USER_ROLE } from "../../constants/status.constants";

export type TLogin = {
  emailOrPhone: string;
  password: string;
};

const signUpZodSchema = z.object({
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
      ),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(6, "Password must be at least 6 characters")
      .max(255)
      .trim(),
    profilePicture: z
      .string()
      .optional(),
    role: z
      .enum(Object.values(USER_ROLE) as [string, ...string[]], {
        invalid_type_error: "Role must be a valid role",
      })
      .optional(),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    emailOrPhone: z
      .string({
        required_error: "Email or phone is required",
        invalid_type_error: "Email or phone must be a string",
      })
      .refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\d{11}$/.test(val),
        { message: "Must be a valid email or 11-digit phone number" }
      ),
    password: z.string().min(6, "Password must be at least 6 characters").trim(),
  }),
});

// COMMENTED OUT: Email OTP verification is no longer required for signup
// export const emailVerificationValidationSchema = z.object({
//   body: z.object({
//     email: z
//       .string({
//         required_error: "Email is required",
//         invalid_type_error: "Email must be valid email address",
//       })
//       .email("Invalid email address"),
//     otp: z.string(
//       {
//         required_error: "OTP is required",
//         invalid_type_error: "OTP must be valid OTP",
//       }
//     ).min(6, "OTP must be 6 digits").max(6),
//   }),
// });

// COMMENTED OUT: Email link verification is no longer required
// export const emailLinkVerificationValidationSchema = z.object({
//   query: z.object({
//     email: z.string().email("Invalid email address"),
//     token: z.string().min(6, "Verification code must be 6 digits").max(6),
//   }),
// });

// COMMENTED OUT: Resend verification is no longer required
// export const resendVerificationValidationSchema = z.object({
//   body: z.object({
//     email: z.string().email("Invalid email address"),
//   }),
// });

const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    emailOrPhone: z
      .string({
        required_error: "Email or phone is required",
        invalid_type_error: "Email or phone must be a string",
      })
      .refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\d{11}$/.test(val),
        { message: "Must be a valid email or 11-digit phone number" }
      ),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "User ID is required",
      invalid_type_error: "User ID must be a string",
    }),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const AuthValidations = {
  signUpZodSchema,
  loginZodSchema,
  // COMMENTED OUT: Email verification validation schemas no longer used
  // emailVerificationValidationSchema,
  // emailLinkVerificationValidationSchema,
  // resendVerificationValidationSchema,
  changePasswordZodSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
