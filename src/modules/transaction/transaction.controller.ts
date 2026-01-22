import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { transactionService } from "./transaction.service";

const createTransactionController = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { orderId, paymentMethodId, userProvidedTransactionId } = req.body;

    const result = await transactionService.createTransactionService(userId, {
        orderId,
        paymentMethodId,
        userProvidedTransactionId,
    });

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Transaction created successfully. Waiting for admin verification.",
        data: result,
    });
});

const getUserTransactionHistoryController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await transactionService.getUserTransactionHistoryService(userId, page, limit);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User transaction history retrieved successfully",
            data: result,
        });
    }
);

const getAllTransactionHistoryController = catchAsync(
    async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await transactionService.getAllTransactionHistoryService(page, limit);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "All transaction history retrieved successfully",
            data: result,
        });
    }
);

const getTransactionByIdController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await transactionService.getTransactionByIdService(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Transaction retrieved successfully",
        data: result,
    });
});

const updateTransactionStatusController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { transactionStatus, adminNotes } = req.body;

    const result = await transactionService.updateTransactionStatusService(id as string, {
        transactionStatus,
        adminNotes,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Transaction status updated successfully",
        data: result,
    });
});

const getTransactionByOrderIdController = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params as { orderId: string };
    const result = await transactionService.getTransactionByOrderIdService(orderId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Transaction for order retrieved successfully",
        data: result,
    });
});

export const transactionController = {
    createTransactionController,
    getUserTransactionHistoryController,
    getAllTransactionHistoryController,
    getTransactionByIdController,
    updateTransactionStatusController,
    getTransactionByOrderIdController,
};
