import { Router } from "express";
import { USER_ROLE } from "../../constants/status.constants";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { orderController } from "./order.controller";
import { orderValidation } from "./order.validation";

const orderRouter = Router();

/**
 * Create order (By User)
 */
orderRouter.post(
    "/",
    auth(USER_ROLE.USER),
    validateRequest(orderValidation.createOrderZodSchema),
    orderController.createOrder
);

/**
 * Get user orders (By User)
 */
orderRouter.get("/", auth(USER_ROLE.USER), orderController.getOrders);

/**
 * Get all orders (By Admin)
 */
orderRouter.get("/all", auth(USER_ROLE.ADMIN), orderController.getAllOrders);

/**
 * Get specific order (By User and Admin)
 */
orderRouter.get("/:orderId", auth(USER_ROLE.USER, USER_ROLE.ADMIN), orderController.getOrder);

/**
 * Update order status (By Admin)
 */
orderRouter.patch("/:orderId/status", auth(USER_ROLE.ADMIN), orderController.updateOrderStatus);

export default orderRouter;
