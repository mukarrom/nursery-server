import { USER_ROLE, USER_STATUS } from "../../constants/status.constants";

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export type TUser = {
  name: string;
  phone?: string;
  email: string;
  password: string;
  profilePicture?: string;
  address?: string;
  role?: TUserRole;
  isEmailVerified?: boolean;
  status?: TUserStatus;
  isDeleted?: boolean;
  passwordChangedAt?: Date;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  accessToken?: string;
  refreshToken?: string;
};
