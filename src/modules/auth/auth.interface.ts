export type TSignUp = {
  name: string;
  phone?: string;
  email: string;
  password: string;
  role?: string;
};

export type TLogin = {
  email: string;
  password: string;
};
