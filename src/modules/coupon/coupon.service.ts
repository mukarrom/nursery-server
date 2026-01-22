import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { CouponModel } from "./coupon.model";

export const createCouponService = async (couponData: any) => {
    const existingCoupon = await CouponModel.findOne({ code: couponData.code.toUpperCase() });
    if (existingCoupon) {
        throw new AppError(400, "Coupon code already exists");
    }

    const coupon = await CouponModel.create({
        ...couponData,
        code: couponData.code.toUpperCase(),
    });

    return coupon;
};

export const getCouponByCodeService = async (code: string) => {
    const coupon = await CouponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) {
        throw new AppError(404, "Coupon not found");
    }
    return coupon;
};

export const validateCouponService = async (code: string, orderTotal: number) => {
    const coupon = await CouponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) {
        throw new AppError(404, "Coupon not found");
    }

    if (!coupon.isActive) {
        throw new AppError(400, "Coupon is inactive");
    }

    const now = new Date();
    if (coupon.validFrom > now) {
        throw new AppError(400, "Coupon is not yet valid");
    }

    if (coupon.validUntil < now) {
        throw new AppError(400, "Coupon has expired");
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
        throw new AppError(400, "Coupon usage limit reached");
    }

    if (coupon.minOrderAmount && orderTotal < coupon.minOrderAmount) {
        throw new AppError(400, `Minimum order amount of ${coupon.minOrderAmount} required`);
    }

    return coupon;
};

export const applyCouponService = async (code: string) => {
    const coupon = await CouponModel.findOne({ code: code.toUpperCase() });
    if (!coupon) {
        throw new AppError(404, "Coupon not found");
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
        throw new AppError(400, "Coupon usage limit reached");
    }

    coupon.currentUses += 1;
    await coupon.save();

    return coupon;
};

export const getAllCouponsService = async (query: Record<string, unknown>) => {
    const couponQuery = new QueryBuilder(CouponModel.find({}), query)
        .search(["code", "description"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const coupons = await couponQuery.modelQuery;
    const meta = await couponQuery.countTotal();
    return { coupons, meta };
};

export const updateCouponService = async (couponId: string, updateData: any) => {
    const coupon = await CouponModel.findByIdAndUpdate(couponId, updateData, { new: true });
    if (!coupon) {
        throw new AppError(404, "Coupon not found");
    }
    return coupon;
};

export const deleteCouponService = async (couponId: string) => {
    const coupon = await CouponModel.findByIdAndDelete(couponId);
    if (!coupon) {
        throw new AppError(404, "Coupon not found");
    }
    return coupon;
};

export const couponService = {
    createCouponService,
    getCouponByCodeService,
    validateCouponService,
    applyCouponService,
    getAllCouponsService,
    updateCouponService,
    deleteCouponService,
};
