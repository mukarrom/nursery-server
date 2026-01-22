import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { USER_ROLE } from "../../constants/status.constants";
import AppError from "../../errors/AppError";
import { UserModel } from "./users.model";


const updateProfile = async (userId: string, payload: any) => {
  const user = await UserModel.findByIdAndUpdate(userId, payload, { new: true });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

/// Get all users list
const getAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    UserModel.find({ role: USER_ROLE.USER }).select("id name email phone role status"),
    query
  )
    .search(["name", "email", "phone"])
    .filter()
    .sort()
    .paginate()
    .fields();
  const users = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  if (!users || users.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Users not found");
  }
  return { users, meta };
};

/// Update user status
const updateStatus = async (userId: string, status: string) => {
  const user = await UserModel.findByIdAndUpdate(userId, { status }, { new: true });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

export const userService = {
  updateProfile,
  getAllUsers,
  updateStatus,
};
