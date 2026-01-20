import { CouponModel } from "./coupon.model";
import AppError from "../../errors/AppError";

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

export const getAllCouponsService = async (isActive?: boolean) => {
  const query = isActive !== undefined ? { isActive } : {};
  const coupons = await CouponModel.find(query).sort({ createdAt: -1 });
  return coupons;
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
