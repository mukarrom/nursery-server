import { z } from "zod";
import { USER_ROLE } from "../../constants/status.constants";

export type TLogin = {
  email?: string;
  phone?: string;
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
    phone: z
      .string({
        invalid_type_error: "Phone number must be a string",
      })
      .min(11, "Phone number must be 11 digits")
      .max(11, "Phone number must be 11 digits")
      .optional(),
    email: z
      .string({
        invalid_type_error: "Email must be valid email address",
      })
      .email("Invalid email address")
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(255)
      .optional(),
    profilePicture: z
      .string()
      .optional(),
    role: z
      .enum(Object.values(USER_ROLE) as [string, ...string[]], {
        invalid_type_error: "Role must be a valid role",
      })
      .optional(),
  }).refine(
    (data) => data.email || data.phone,
    {
      message: "Either email or phone number is required",
      path: ["email"],
    }
  ),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        invalid_type_error: "Email must be valid registered email address",
      })
      .email("Invalid email address")
      .optional(),
    phone: z
      .string({
        invalid_type_error: "Phone number must be a string",
      })
      .min(11, "Phone number must be 11 digits")
      .max(11, "Phone number must be 11 digits")
      .optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }).refine(
    (data) => data.email || data.phone,
    {
      message: "Either email or phone number is required",
      path: ["email"],
    }
  ),
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

const requestPasswordResetValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be valid email address",
      })
      .email("Invalid email address"),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be valid email address",
      })
      .email("Invalid email address"),
    token: z.string({
      required_error: "Token is required",
      invalid_type_error: "Token must be valid token",
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
  requestPasswordResetValidationSchema,
  resetPasswordValidationSchema,
};
