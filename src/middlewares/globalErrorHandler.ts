/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// Import necessary modules and types from external files
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import AppError from "../errors/AppError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import handleValidationError from "../errors/handleValidationError";
import handleZodError from "../errors/handleZodError";
import { IErrorSource } from "../interface/error";

// Define a global error handler middleware for Express
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Setting default values for error response
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: IErrorSource[] = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  // Check the type of error and handle accordingly
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    // Handle custom AppError
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    // Handle generic Error
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  // Send a JSON response with the error information
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    // stack: config.NODE_ENV === "development" ? err?.stack : null,
    stack: err?.stack,
  });
};

// Export the global error handler middleware for use in other modules
export default globalErrorHandler;
