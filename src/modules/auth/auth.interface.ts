export type TSignUp = {
  name: string;
  phone?: string;
  email: string;
  password: string;
  role?: string;
};

export type TLogin = {
  email?: string;
  phone?: string;
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
