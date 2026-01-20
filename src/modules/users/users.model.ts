import { Model, model, Schema } from "mongoose";
import { USER_ROLE, USER_STATUS } from "../../constants/status.constants";
import { TUser } from "./users.interface";

export interface IUserModel extends Model<TUser> {
  isUserExists(id: string): Promise<TUser | null>;
  isUserByEmail(email: string): Promise<TUser | null>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedAt: Date,
    jwtIssuedAt: number
  ): boolean;
}

const UserSchema = new Schema<TUser, IUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profilePicture: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
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
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.statics.isUserExists = async function (id: string) {
  return await this.findById(id).select("+password");
};

UserSchema.statics.isUserByEmail = async function (email: string) {
  return await this.findOne({ email }).select("+password");
};

/// return user data without password and other sensitive information
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.accessToken;
  delete obj.refreshToken;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationTokenExpires;
  delete obj.passwordResetToken;
  delete obj.passwordResetTokenExpires;
  delete obj.isDeleted;
  return obj;
};

UserSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedAt: Date,
  jwtIssuedAt: number
) {
  const passwordChangedTime = new Date(passwordChangedAt).getTime() / 1000;
  return passwordChangedTime > jwtIssuedAt;
};

export const UserModel = model<TUser, IUserModel>("User", UserSchema);
