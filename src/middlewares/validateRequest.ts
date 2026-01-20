import { AnyZodObject } from "zod";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

const validateRequest = (schema: AnyZodObject) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // parse and validate request data against the provided schema
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  });

export default validateRequest;
