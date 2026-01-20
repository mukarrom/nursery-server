// Import necessary modules and types from external files
import { ZodError, ZodIssue } from "zod";
import { IErrorSource, IGenericErrorResponse } from "../interface/error";

// Define a function to handle Zod errors and convert them into a generic error response
const handleZodError = (err: ZodError): IGenericErrorResponse => {
  // Map through the Zod issues to extract relevant information for error sources
  const errorSources: IErrorSource[] = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1], // Extract the path of the error source
      message: issue.message, // Extract the error message
    };
  });

  // Set a default HTTP status code for validation errors
  const statusCode = 400;

  // Return a generic error response with the extracted information
  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

// Export the function for use in other modules
export default handleZodError;
