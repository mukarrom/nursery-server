import { Router } from "express";
import { cartController } from "./cart.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { cartValidation } from "./cart.validation";

const cartRouter = Router();

// Get cart
cartRouter.get("/", auth(), cartController.getCart);

// Add item to cart
cartRouter.post(
  "/add",
  auth(),
  validateRequest(cartValidation.updateCartZodSchema),
  cartController.addItemToCart
);

// Update cart item quantity
cartRouter.patch(
  "/:productId",
  auth(),
  validateRequest(cartValidation.updateCartZodSchema),
  cartController.updateCartItemQuantity
);

// Remove item from cart
cartRouter.delete("/:productId", auth(), cartController.removeItemFromCart);

// Clear cart
cartRouter.delete("/", auth(), cartController.clearCart);

export default cartRouter;
