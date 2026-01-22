import { Schema } from "mongoose";
import { TAuth } from "./auth.interface";

const AuthSchema = new Schema<TAuth>(
  {
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)