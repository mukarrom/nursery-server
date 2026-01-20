import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  createOrderService,
  getOrderByIdService,
  getOrdersByUserService,
  updateOrderStatusService,
} from "./order.service";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { shippingAddressId, discountCode, paymentMethod } = req.body;

  const order = await createOrderService(userId, shippingAddressId, discountCode, paymentMethod);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Order created successfully",
    data: order,
  });
});

export const getOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params as { orderId: string };

  const order = await getOrderByIdService(orderId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Order retrieved successfully",
    data: order,
  });
});

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const orders = await getOrdersByUserService(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Orders retrieved successfully",
    data: orders,
  });
});

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
  updateOrderStatus,
};
