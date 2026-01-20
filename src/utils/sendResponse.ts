import { Response } from "express";

type TMeta = {
  totalDocuments: number;
  totalPages: number;
  currentPage: number;
  limitPerPage: number;
};

interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: TMeta;
  data: T;
}

// define a utility function to send responses
const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data?.success,
    message: data?.message,
    meta: data?.meta,
    data: data?.data,
  });
};

export default sendResponse;
