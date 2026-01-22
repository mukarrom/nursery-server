import QueryBuilder from "../../builder/QueryBuilder";
import { USER_ROLE } from "../../constants/status.constants";
import AppError from "../../errors/AppError";
import { AddressModel } from "../address/address.model";
import { CartModel } from "../cart/cart.model";
import { CouponModel } from "../coupon/coupon.model";
import { OrderModel } from "./order.model";

/**
 * Create order (By User)
 * @param userId User ID
 * @param shippingAddressId Shipping address ID
 * @param selectedProductIds Array of product IDs to order
 * @param discountCode Discount code
 * @param paymentMethod Payment method
 * @returns Order
 */
export const createOrderService = async (
    userId: string,
    shippingAddressId: string,
    selectedProductIds: string[],
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

    // Filter cart items to only include selected products
    const selectedItems = cart.items.filter((item: any) =>
        selectedProductIds.includes(item.productId._id.toString())
    );

    if (selectedItems.length === 0) {
        throw new AppError(400, "No valid products selected for order");
    }

    // Calculate subtotal from selected items only
    const subtotal = selectedItems.reduce((sum: number, item: any) => sum + item.total, 0);

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

        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
            throw new AppError(400, `Minimum order amount of ${coupon.minOrderAmount} required`);
        }

        if (coupon.discountType === "percentage") {
            discountAmount = (subtotal * coupon.discountValue) / 100;
        } else {
            discountAmount = coupon.discountValue;
        }

        coupon.currentUses += 1;
        await coupon.save();
    }

    // Snapshot selected cart items
    const items = selectedItems.map((item: any) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
    }));

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

/**
 * Get order by ID (By User)
 * @param orderId Order ID
 * @returns Order
 */
export const getOrderByIdService = async (orderId: string, role: string, userId: string) => {
    if (role === USER_ROLE.USER) {
        const order = await OrderModel.findOne({ orderId, userId });
        if (!order) {
            throw new AppError(404, "Order not found");
        }
        return order;
    }
    const order = await OrderModel.findOne({ orderId });
    if (!order) {
        throw new AppError(404, "Order not found");
    }
    return order;
};

/**
 * Get orders by user (By User)
 * @param userId User ID
 * @returns Orders
 */
export const getOrdersByUserService = async (userId: string, query: Record<string, unknown>) => {
    const orderQuery = new QueryBuilder(OrderModel.find({ userId }), query).search([]).filter().sort().paginate().fields();
    const orders = await orderQuery.modelQuery;
    const meta = await orderQuery.countTotal();
    return { orders, meta };
};

/**
 * Get all orders (By Admin)
 * @returns Orders
 */
export const getAllOrdersService = async (query: Record<string, unknown>) => {
    const orderQuery = new QueryBuilder(OrderModel.find(), query).search([]).filter().sort().paginate().fields();
    const orders = await orderQuery.modelQuery;
    const meta = await orderQuery.countTotal();
    return { orders, meta };
};

/**
 * Update order status (By Admin)
 * @param orderId Order ID
 * @param status Status
 * @returns Order
 */
export const updateOrderStatusService = async (orderId: string, status: string) => {
    console.log(`Updating order ${orderId} to status ${status}`);
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
    getAllOrdersService,
    updateOrderStatusService,
};
