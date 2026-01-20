import { Request, Response } from "express";
import status from "http-status";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { uploadVideo } from "../../utils/videoUpload";
import { TTest } from "./tests.interface";
import { TestServices } from "./tests.service";

// controller to create test data
const createTestData = catchAsync(async (req: Request, res: Response) => {
  // 1. Validate Input
  if (!req.file) {
    throw new AppError(status.BAD_REQUEST, "Video file is required");
  }

  // 2. Validate File Type (more comprehensive check)
  const validVideoTypes = [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-flv',
    'video/webm'
  ];

  if (!validVideoTypes.includes(req.file.mimetype)) {
    throw new AppError(
      status.BAD_REQUEST,
      `Invalid video format. Supported formats: ${validVideoTypes.join(', ')}`
    );
  }

  // 3. Validate File Size (optional but recommended)
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
  if (req.file.size > MAX_VIDEO_SIZE) {
    throw new AppError(
      status.BAD_REQUEST,
      `Video too large. Maximum size is ${MAX_VIDEO_SIZE / (1024 * 1024)}MB`
    );
  }

  // 4. Upload to Cloudinary
  const uploadResult = await uploadVideo(
    req.file.buffer,
    'tests' // Optional folder organization
  );

  // 5. Prepare data for database
  const testData: TTest = {
    title: req.body.title,
    test: uploadResult.url,
    // Consider storing additional video metadata
    // videoMetadata: {
    //   publicId: uploadResult.public_id,
    //   duration: uploadResult.duration,
    //   format: uploadResult.format,
    //   originalName: req.file.originalname
    // }
  };

  // 6. Save to database
  const result = await TestServices.createTestService(testData);

  // 7. Send response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Test data created successfully",
    data: {
      ...result,
      // Include additional info if needed
      videoInfo: {
        duration: uploadResult.duration,
        format: uploadResult.format
      }
    },
  });
});
// const createTestData = catchAsync(async (req: Request, res: Response) => {

//   console.log("Request body:", req.body);

//   if (!req.file) {
//     throw new AppError(status.BAD_REQUEST, "File is required");
//   }

//   if (!(req.file.buffer instanceof Buffer)) {

//     throw new AppError(status.BAD_REQUEST, "Invalid file format");
//   }

//   const uploadResult = await uploadVideo(req.file.buffer);



//   const body: TTest = {
//     title: req.body.title,
//     test: uploadResult.url,
//   };

//   const result = await TestServices.createTestService(body);

//   sendResponse(res, {
//     statusCode: status.CREATED,
//     success: true,
//     message: "Test Data created successfully",
//     data: result,
//   });
// });

// get test data
const getTestData = catchAsync(async (req: Request, res: Response) => {
  const result = await TestServices.getTestsService();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Test Data retrieved successfully",
    data: result,
  });
});

export const testControllers = {
  createTestData,
  getTestData,
};
