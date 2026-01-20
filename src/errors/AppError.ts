// Define a custom error class that extends the built-in Error class
class AppError extends Error {
  // Public property to store HTTP status code
  public statusCode: number;

  // Constructor for the custom error class
  constructor(statusCode: number, message: string, stack = "") {
    // Call the constructor of the parent Error class with the error message
    super(message);

    // Assign the provided HTTP status code to the instance property
    this.statusCode = statusCode;

    // Check if a custom stack trace is provided, otherwise capture the stack trace
    if (stack) {
      // Use the provided stack if available
      this.stack = stack;
    } else {
      // Capture the stack trace using Error.captureStackTrace
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Export the custom error class for use in other modules
export default AppError;
