import { RequestHandler } from "express";
import httpStatus from "http-status";

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const notFound: RequestHandler = (req, res, next): void => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Api not found",
    error: "Api not found, please check your url",
  });
};

export default notFound;
