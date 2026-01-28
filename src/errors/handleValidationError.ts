// Import necessary modules and types from external files
import mongoose from "mongoose";
import { IErrorSource, IGenericErrorResponse } from "../interface/error";

// Define a function to handle Mongoose ValidationErrors and convert them into a generic error response
const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  // Map through validation errors to extract relevant information
  const errorSources: IErrorSource[] = Object.values(err.errors).map(
    (val: any) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    }
  );

  // Set HTTP status code for validation errors
  const statusCode = 400;

  // Return a generic error response with the extracted information
  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

// Export the function for use in other modules
export default handleValidationError;
