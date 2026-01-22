import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { OrderModel } from "../order/order.model";
import { PaymentMethodModel } from "../payment-method/payment-method.model";
import { TTransaction } from "./transaction.interface";
import { TransactionModel } from "./transaction.model";

export const createTransactionService = async (
    userId: string,
    data: {
        orderId: string;
        paymentMethodId: string;
        userProvidedTransactionId: string;
    }
) => {
    // Verify order exists and belongs to user
    const order = await OrderModel.findOne({ orderId: data.orderId, userId });
    // console.log("data.orderId", data.orderId);
    // console.log("userId", userId);
    if (!order) {
        throw new AppError(404, "Order not found or does not belong to this user");
    }

    // Verify payment method exists and is active
    const paymentMethod = await PaymentMethodModel.findById(data.paymentMethodId);
    if (!paymentMethod) {
        throw new AppError(404, "Payment method not found");
    }

    if (!paymentMethod.isActive) {
        throw new AppError(400, "Selected payment method is not available");
    }

    // Generate unique transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const transactionData: TTransaction = {
        transactionId,
        orderId: data.orderId,
        userId,
        paymentMethodId: data.paymentMethodId.toString(),
        amount: order.total,
        transactionStatus: "pending",
        userProvidedTransactionId: data.userProvidedTransactionId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await TransactionModel.create(transactionData);

    // Update order's payment method and status
    await OrderModel.findOneAndUpdate(
        { orderId: data.orderId },
        {
            paymentMethod: paymentMethod.methodName,
            paymentStatus: "pending",
        }
    );

    return result;
};

export const getTransactionByIdService = async (transactionId: string) => {
    const result = await TransactionModel.findById(transactionId)
        .populate("paymentMethodId", "methodName accountNumber description")
        .lean();

    if (!result) {
        throw new AppError(404, "Transaction not found");
    }
    return result;
};

export const getMyTransactionHistoryService = async (userId: string, query: Record<string, unknown>) => {
    const transactionsQuery = new QueryBuilder(TransactionModel.find({ userId }).populate("paymentMethodId", "methodName accountNumber description").populate({ path: "order", select: "orderId total orderStatus" }), query)
        .search(["transactionId", "orderId", "methodName", "accountNumber", "userProvidedTransactionId", "amount", "transactionStatus", "adminNotes"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const transactions = await transactionsQuery.modelQuery;
    const meta = await transactionsQuery.countTotal();

    return {
        data: transactions,
        pagination: meta,
    };
};

export const getAllTransactionHistoryService = async (query: Record<string, unknown>) => {
    const transactionsQuery = new QueryBuilder(TransactionModel.find().populate("userId", "name email").populate("paymentMethodId", "methodName accountNumber").populate({ path: "order", select: "orderId total orderStatus" }), query)
        .search(["transactionId", "orderId", "methodName", "accountNumber", "userProvidedTransactionId", "amount", "transactionStatus", "adminNotes"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const transactions = await transactionsQuery.modelQuery;
    const meta = await transactionsQuery.countTotal();

    return {
        data: transactions,
        pagination: meta,
    };
};

// export const getTransactionByOrderIdService = async (orderId: string) => {
//     const result = await TransactionModel.findOne({ orderId })
//         .populate("paymentMethodId", "methodName accountNumber description")
//             .populate("paymentMethodId", "methodName accountNumber")
//             .populate({ path: "order", select: "orderId total orderStatus" })
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit)
//             .lean(),
//         TransactionModel.countDocuments(),
//     ]);

//     return {
//         data,
//         pagination: {
//             currentPage: page,
//             totalPages: Math.ceil(total / limit),
//             totalRecords: total,
//             limit,
//         },
//     };
// };

export const updateTransactionStatusService = async (
    transactionId: string,
    updateData: {
        transactionStatus: "pending" | "completed" | "failed" | "cancelled";
        adminNotes?: string;
    }
) => {
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
        throw new AppError(404, "Transaction not found");
    }

    const result = await TransactionModel.findByIdAndUpdate(transactionId, updateData, {
        new: true,
        runValidators: true,
    });

    // Update order's payment status based on transaction status
    if (updateData.transactionStatus === "completed") {
        await OrderModel.findOneAndUpdate(
            { orderId: transaction.orderId },
            { paymentStatus: "completed" }
        );
    } else if (updateData.transactionStatus === "failed") {
        await OrderModel.findOneAndUpdate(
            { orderId: transaction.orderId },
            { paymentStatus: "failed" }
        );
    } else if (updateData.transactionStatus === "cancelled") {
        await OrderModel.findOneAndUpdate(
            { orderId: transaction.orderId },
            { paymentStatus: "pending" }
        );
    }

    return result;
};

export const getTransactionByOrderIdService = async (orderId: string) => {
    const result = await TransactionModel.findOne({ orderId })
        .populate("paymentMethodId", "methodName accountNumber description")
        .populate({ path: "order", select: "orderId total orderStatus" })
        .lean();

    if (!result) {
        throw new AppError(404, "Transaction not found for this order");
    }
    return result;
};

export const transactionService = {
    createTransactionService,
    getTransactionByIdService,
    getMyTransactionHistoryService,
    getAllTransactionHistoryService,
    updateTransactionStatusService,
    getTransactionByOrderIdService,
};
