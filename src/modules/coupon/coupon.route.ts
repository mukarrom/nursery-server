import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { couponController } from "./coupon.controller";
import { couponValidation } from "./coupon.validation";

const couponRouter = Router();

// Create coupon (admin only - can be restricted later)
couponRouter.post(
    "/",
    validateRequest(couponValidation.createCouponZodSchema),
    couponController.createCoupon
);

// Get all coupons
couponRouter.get("/", couponController.getAllCoupons);

// Get coupon by code
couponRouter.get("/:code", couponController.getCouponByCode);

// Validate coupon
couponRouter.post(
    "/validate",
    validateRequest(couponValidation.applyCouponZodSchema),
    couponController.validateCoupon
);

// Apply coupon
couponRouter.post("/apply", couponController.applyCoupon);

// Update coupon
couponRouter.patch(
    "/:couponId",
    validateRequest(couponValidation.updateCouponZodSchema),
    couponController.updateCoupon
);

// Delete coupon
couponRouter.delete("/:couponId", couponController.deleteCoupon);

export default couponRouter;
