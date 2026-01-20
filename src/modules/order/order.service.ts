import { OrderModel } from "./order.model";
import { CartModel } from "../cart/cart.model";
import { AddressModel } from "../address/address.model";
import { CouponModel } from "../coupon/coupon.model";
import { ProductModel } from "../products/products.model";
import AppError from "../../errors/AppError";

export const createOrderService = async (
  userId: string,
  shippingAddressId: string,
  discountCode?: string,
  paymentMethod?: string
) => {
  const cart = await CartModel.findOne({ userId }).populate("items.productId");
  if (!cart || cart.items.length === 0) {
    throw new AppError(400, "Cart is empty");
  }

  const shippingAddress = await AddressModel.findById(shippingAddressId);
  if (!shippingAddress || shippingAddress.userId.toString() !== userId) {
    throw new AppError(400, "Invalid shipping address");
  }

  let discountAmount = 0;
  if (discountCode) {
    const coupon = await CouponModel.findOne({ code: discountCode.toUpperCase() });
    if (!coupon) {
      throw new AppError(400, "Invalid discount code");
    }

    const now = new Date();
    if (coupon.validFrom > now || coupon.validUntil < now) {
      throw new AppError(400, "Discount code has expired");
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      throw new AppError(400, "Discount code usage limit reached");
    }

    if (coupon.minOrderAmount && cart.subtotal < coupon.minOrderAmount) {
      throw new AppError(400, `Minimum order amount of ${coupon.minOrderAmount} required`);
    }

    if (coupon.discountType === "percentage") {
      discountAmount = (cart.subtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    coupon.currentUses += 1;
    await coupon.save();
  }

  // Snapshot cart items
  const items = cart.items.map((item: any) => ({
    productId: item.productId._id,
    name: item.productId.name,
    price: item.price,
    quantity: item.quantity,
    total: item.total,
  }));

  const subtotal = cart.subtotal;
  const tax = subtotal * 0.05; // 5% tax
  const shippingCost = subtotal > 5000 ? 0 : 100; // Free shipping over 5000
  const total = subtotal + tax + shippingCost - discountAmount;

  const order = await OrderModel.create({
    orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
    userId,
    items,
    shippingAddress: {
      street: shippingAddress.street,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      phoneNumber: shippingAddress.phoneNumber,
    },
    billingAddress: {
      street: shippingAddress.street,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      phoneNumber: shippingAddress.phoneNumber,
    },
    tax,
    shippingCost,
    subtotal,
    discountCode: discountCode?.toUpperCase(),
    discountAmount,
    total,
    paymentMethod: paymentMethod || "cash",
    orderStatus: "pending",
    paymentStatus: "pending",
  });

  // Clear cart
  await CartModel.deleteOne({ userId });

  return order;
};

export const getOrderByIdService = async (orderId: string) => {
  const order = await OrderModel.findOne({ orderId });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  return order;
};

export const getOrdersByUserService = async (userId: string) => {
  const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
  return orders;
};

export const updateOrderStatusService = async (orderId: string, status: string) => {
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new AppError(400, "Invalid status");
  }

  const order = await OrderModel.findOneAndUpdate(
    { orderId },
    { orderStatus: status, updatedAt: new Date() },
    { new: true }
  );

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  return order;
};

export const orderService = {
  createOrderService,
  getOrderByIdService,
  getOrdersByUserService,
  updateOrderStatusService,
};
