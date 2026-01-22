import { Router } from "express";
import { USER_ROLE } from "../../constants/status.constants";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { cartController } from "./cart.controller";
import { cartValidation } from "./cart.validation";

const cartRouter = Router();

/**
 * Get user's cart
 */
cartRouter.get("/", auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), cartController.getCart);

/**
 * Add item to cart
 */
cartRouter.post(
    "/add",
    auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    validateRequest(cartValidation.addCartItemZodSchema),
    cartController.addItemToCart
);

// Update cart item quantity
cartRouter.patch(
    "/:productId",
    auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    validateRequest(cartValidation.updateCartItemZodSchema),
    cartController.updateCartItemQuantity
);

// Remove item from cart
cartRouter.delete("/:productId", auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), cartController.removeItemFromCart);

// Clear cart
cartRouter.delete("/", auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), cartController.clearCart);
export default cartRouter;
