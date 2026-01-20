import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./users.service";

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await userService.updateProfile(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

/// Get all users list

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users list fetched successfully",
    data: result,
  });
});

/// Update user status
const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status } = req.body;
  console.log(`endpoint hit: /users/update-status/${userId}\n body: ${status}`)
  const result = await userService.updateStatus(userId as string, status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

export const userController = {
  updateProfile,
  getAllUsers,
  updateStatus,
};
