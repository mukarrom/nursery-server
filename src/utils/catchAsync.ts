import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  // Resolve any promises in the controller function
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;
