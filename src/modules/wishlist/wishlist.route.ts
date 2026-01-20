import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { wishlistController } from "./wishlist.controller";
import { wishlistValidation } from "./wishlist.validation";

const wishlistRouter = Router();

// Get wishlist
wishlistRouter.get("/", auth(), wishlistController.getWishlist);

// Add to wishlist
wishlistRouter.post(
    "/add",
    auth(),
    validateRequest(wishlistValidation.addToWishlistZodSchema),
    wishlistController.addToWishlist
);

// Check if product in wishlist
wishlistRouter.get("/check/:productId", auth(), wishlistController.checkIfInWishlist);

// Remove from wishlist
wishlistRouter.delete("/:productId", auth(), wishlistController.removeFromWishlist);

// Clear wishlist
wishlistRouter.delete("/", auth(), wishlistController.clearWishlist);

export default wishlistRouter;
