import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
    createOrderService,
    getAllOrdersService,
    getOrderByIdService,
    getOrdersByUserService,
    updateOrderStatusService,
} from "./order.service";

/**
 * Create order (By User)
 * @param req Request
 * @param res Response
 */
export const createOrder = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { shippingAddressId, selectedProductIds, discountCode, paymentMethod } = req.body;

    const order = await createOrderService(userId, shippingAddressId, selectedProductIds, discountCode, paymentMethod);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Order created successfully",
        data: order,
    });
});

/**
 * Get order by ID (By User)
 * @param req Request
 * @param res Response
 */
export const getOrder = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params as { orderId: string };
    const role = req.user?.role;
    const userId = req.user?.id;

    const order = await getOrderByIdService(orderId as string, role as string, userId as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Order retrieved successfully",
        data: order,
    });
});

/**
 * Get orders by user (By User)
 * @param req Request
 * @param res Response
 */
export const getOrders = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const query = req.query;

    const orders = await getOrdersByUserService(userId as string, query);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Orders retrieved successfully",
        data: orders,
    });
});

/**
 * Get all orders (By Admin)
 * @param req Request
 * @param res Response
 */
export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const orders = await getAllOrdersService(query);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Orders retrieved successfully",
        data: orders,
    });
});

/**
 * Update order status (By Admin)
 * @param req Request
 * @param res Response
 */
export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params as { orderId: string };
    const { orderStatus } = req.body;

    const order = await updateOrderStatusService(orderId as string, orderStatus);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Order status updated successfully",
        data: order,
    });
});

export const orderController = {
    createOrder,
    getOrder,
    getOrders,
    getAllOrders,
    updateOrderStatus,
};
