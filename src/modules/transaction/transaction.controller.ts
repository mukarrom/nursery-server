import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { transactionService } from "./transaction.service";

/**
 * Create a new transaction
 */
const createTransactionController = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
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

/**
 * Get my transaction history
 */
const getMyTransactionHistoryController = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user.id;
        const query = req.query;

        const result = await transactionService.getMyTransactionHistoryService(userId, query);

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
        const query = req.query;

        const result = await transactionService.getAllTransactionHistoryService(query);

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
    getMyTransactionHistoryController,
    getAllTransactionHistoryController,
    getTransactionByIdController,
    updateTransactionStatusController,
    getTransactionByOrderIdController,
};
