import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
    applyCouponService,
    createCouponService,
    deleteCouponService,
    getAllCouponsService,
    getCouponByCodeService,
    updateCouponService,
    validateCouponService,
} from "./coupon.service";

export const createCoupon = catchAsync(async (req: Request, res: Response) => {
    const couponData = req.body;

    const coupon = await createCouponService(couponData);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Coupon created successfully",
        data: coupon,
    });
});

export const getCouponByCode = catchAsync(async (req: Request, res: Response) => {
    const { code } = req.params as { code: string };

    const coupon = await getCouponByCodeService(code as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Coupon retrieved successfully",
        data: coupon,
    });
});

export const validateCoupon = catchAsync(async (req: Request, res: Response) => {
    const { code, orderTotal } = req.body;

    const coupon = await validateCouponService(code, orderTotal);

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
        discountAmount = (orderTotal * coupon.discountValue) / 100;
    } else {
        discountAmount = coupon.discountValue;
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Coupon is valid",
        data: {
            coupon,
            discountAmount,
            finalTotal: orderTotal - discountAmount,
        },
    });
});

export const applyCoupon = catchAsync(async (req: Request, res: Response) => {
    const { code } = req.body;

    const coupon = await applyCouponService(code);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Coupon applied successfully",
        data: coupon,
    });
});

export const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
    const { isActive } = req.query;

    const coupons = await getAllCouponsService(
        isActive === "true" ? true : isActive === "false" ? false : undefined
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Coupons retrieved successfully",
        data: coupons,
    });
});

export const updateCoupon = catchAsync(async (req: Request, res: Response) => {
    const { couponId } = req.params as { couponId: string };
    const updateData = req.body;

    const coupon = await updateCouponService(couponId as string, updateData);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Coupon updated successfully",
        data: coupon,
    });
});

export const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
    const { couponId } = req.params as { couponId: string };

    const coupon = await deleteCouponService(couponId as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Coupon deleted successfully",
        data: coupon,
    });
});

export const couponController = {
    createCoupon,
    getCouponByCode,
    validateCoupon,
    applyCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
};
