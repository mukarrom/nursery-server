export type TSignUp = {
  name: string;
  emailOrPhone: string;
  password: string;
  profilePicture?: string;
  role?: string;
};

export type TLogin = {
  emailOrPhone: string;
  password: string;
};

export type TAuth = {
  isLoggedIn: boolean;
  loggedInAt: Date;
  loggedOutAt: Date;
  passwordChangedAt?: Date;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
};
