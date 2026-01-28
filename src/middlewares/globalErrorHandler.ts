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

  // Helper function to check if error is E11000 duplicate key error
  const isE11000Error = (error: any): boolean => {
    return (
      error?.code === 11000 ||
      error?.message?.includes("E11000") ||
      error?.name === "MongoServerError"
    );
  };

  // Check the type of error and handle accordingly (order matters - more specific first)
  if (err instanceof ZodError) {
    // Handle Zod validation errors
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (isE11000Error(err)) {
    // Handle MongoDB duplicate key errors (E11000) - MUST be before generic Error!
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    // Handle custom application errors
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err?.name === "ValidationError") {
    // Handle Mongoose schema validation errors
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "CastError") {
    // Handle MongoDB invalid ObjectId errors
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof Error) {
    // Handle generic JavaScript Error objects
    message = err.message || "Unknown error occurred";
    errorSources = [
      {
        path: "",
        message: err.message || "Unknown error",
      },
    ];
  } else {
    // Handle any other unexpected error types
    message = "An unexpected error occurred";
    errorSources = [
      {
        path: "",
        message: typeof err === "string" ? err : "Unknown error",
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
