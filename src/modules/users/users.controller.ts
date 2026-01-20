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

export const userController = {
  updateProfile,
};
