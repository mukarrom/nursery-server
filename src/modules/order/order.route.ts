import { Router } from "express";
import { orderController } from "./order.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { orderValidation } from "./order.validation";

const orderRouter = Router();

// Create order
orderRouter.post(
  "/",
  auth(),
  validateRequest(orderValidation.createOrderZodSchema),
  orderController.createOrder
);

// Get user orders
orderRouter.get("/", auth(), orderController.getOrders);

// Get specific order
orderRouter.get("/:orderId", auth(), orderController.getOrder);

// Update order status
orderRouter.patch("/:orderId/status", auth(), orderController.updateOrderStatus);

export default orderRouter;
