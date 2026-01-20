import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "./users.model";


const updateProfile = async (userId: string, payload: any) => {
  const user = await UserModel.findByIdAndUpdate(userId, payload, { new: true });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

export const userService = {
  updateProfile,
};
