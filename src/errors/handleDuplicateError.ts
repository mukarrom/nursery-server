// Import necessary modules and types from external files
import { IErrorSource, IGenericErrorResponse } from "../interface/error";

// Define a function to handle MongoDB Duplicate Key (E11000) errors with custom messages
const handleDuplicateError = (err: any): IGenericErrorResponse => {
  // Extract field and value from keyValue object (MongoDB error structure)
  let field = "";
  let value = "";

  if (err.keyValue && typeof err.keyValue === "object") {
    // Primary approach: extract from keyValue (direct MongoDB error)
    field = Object.keys(err.keyValue)[0];
    value = err.keyValue[field];
  } else if (err.message && err.message.includes("E11000")) {
    // Fallback: parse from error message string
    // Message format: "E11000 duplicate key error collection: nursery.users index: email_1 dup key: { email: \"user@mail.com\" }"
    const fieldMatch = err.message.match(/index: (\w+)_/);
    if (fieldMatch) {
      field = fieldMatch[1];
    }

    // Extract the duplicate value from message
    const valueMatch = err.message.match(/{[\s\w":.]+:\s*"([^"]+)"/);
    if (valueMatch) {
      value = valueMatch[1];
    }
  }

  // Create error source with descriptive message
  const errorSources: IErrorSource[] = [
    {
      path: field || "unknown",
      message:
        field && value
          ? `${field} "${value}" already exists.`
          : "A duplicate entry was detected.",
    },
  ];

  // HTTP 409 Conflict is the correct status for duplicate entries
  const statusCode = 409;

  // Return formatted error response
  return {
    statusCode,
    message: "Duplicate Entry",
    errorSources,
  };
};

// Export the function for use in other modules
export default handleDuplicateError;
