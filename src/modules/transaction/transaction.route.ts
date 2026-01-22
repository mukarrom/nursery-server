import { Router } from "express";
import { USER_ROLE } from "../../constants/status.constants";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { transactionController } from "./transaction.controller";
import { transactionValidation } from "./transaction.validation";

const transactionRouter = Router();

/**
 * Create transaction (By User - during checkout)
 */
transactionRouter.post(
    "/",
    auth(USER_ROLE.USER),
    validateRequest(transactionValidation.createTransactionZodSchema),
    transactionController.createTransactionController
);

/**
 * Get user transaction history (By User)
 */
transactionRouter.get(
    "/history/user",
    auth(USER_ROLE.USER),
    transactionController.getUserTransactionHistoryController
);

/**
 * Get all transaction history (By Admin)
 */
transactionRouter.get(
    "/history/all",
    auth(USER_ROLE.ADMIN),
    transactionController.getAllTransactionHistoryController
);

/**
 * Get transaction by order ID (By User and Admin)
 */
transactionRouter.get(
    "/order/:orderId",
    auth(USER_ROLE.USER, USER_ROLE.ADMIN),
    transactionController.getTransactionByOrderIdController
);

/**
 * Get specific transaction (By Admin)
 */
transactionRouter.get(
    "/:id",
    auth(USER_ROLE.ADMIN),
    transactionController.getTransactionByIdController
);

/**
 * Update transaction status (By Admin only)
 */
transactionRouter.patch(
    "/:id/status",
    auth(USER_ROLE.ADMIN),
    validateRequest(transactionValidation.updateTransactionStatusZodSchema),
    transactionController.updateTransactionStatusController
);

export default transactionRouter;
