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
 * @param transactionId Transaction ID (required for non-cash payments)
 * @returns Order
 */
export const createOrderService = async (
    userId: string,
    shippingAddressId: string,
    selectedProductIds: string[],
    discountCode?: string,
    paymentMethod?: string,
    transactionId?: string
) => {
    // Validate transaction ID requirement for non-cash payments
    const cashOnDeliveryVariants = ["cash", "cod", "cash on delivery", "cash_on_delivery"];
    const isCashOnDelivery = !paymentMethod || cashOnDeliveryVariants.includes(paymentMethod.toLowerCase());

    if (!isCashOnDelivery && !transactionId) {
        throw new AppError(400, "Transaction ID is required for non-cash on delivery payments");
    }

    // Start MongoDB session for transaction
    const session = await OrderModel.startSession();
    session.startTransaction();

    try {
        const cart = await CartModel.findOne({ userId }).populate("items.productId").session(session);
        if (!cart || cart.items.length === 0) {
            throw new AppError(400, "Cart is empty");
        }

        const shippingAddress = await AddressModel.findById(shippingAddressId).session(session);
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
            const coupon = await CouponModel.findOne({ code: discountCode.toUpperCase() }).session(session);
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
            await coupon.save({ session });
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

        // Create order with transaction session
        const orderData = {
            orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
            userId,
            items,
            shippingAddress: {
                street: shippingAddress.street,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
            },
            billingAddress: {
                street: shippingAddress.street,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
            },
            tax,
            shippingCost,
            subtotal,
            discountCode: discountCode?.toUpperCase(),
            discountAmount,
            total,
            paymentMethod: paymentMethod || "cash",
            transactionId: transactionId || undefined,
            orderStatus: "pending",
            paymentStatus: isCashOnDelivery ? "pending" : "completed",
        };

        const [order] = await OrderModel.create([orderData], { session });

        // Clear cart after successful order creation
        await CartModel.deleteOne({ userId }, { session });

        // Commit the transaction
        await session.commitTransaction();

        return order;
    } catch (error) {
        // Rollback transaction on any error
        await session.abortTransaction();
        console.error("Order creation failed, transaction rolled back:", error);
        throw error;
    } finally {
        // End session
        session.endSession();
    }
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

/**
 * Cancel order (By User)
 * @param orderId Order ID
 * @param userId User ID
 * @returns Order
 */
export const cancelOrderService = async (orderId: string, userId: string) => {
    const order = await OrderModel.findOne({ orderId, userId });

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    // Check if order is already cancelled or delivered
    if (order.orderStatus === "cancelled") {
        throw new AppError(400, "Order is already cancelled");
    }

    if (order.orderStatus === "delivered") {
        throw new AppError(400, "Cannot cancel a delivered order");
    }

    // Check if order is within 6 hours of creation
    const currentTime = new Date();
    const orderCreationTime = new Date(order.createdAt);
    const timeDifferenceInHours = (currentTime.getTime() - orderCreationTime.getTime()) / (1000 * 60 * 60);

    if (timeDifferenceInHours > 6) {
        throw new AppError(400, "Order can only be cancelled within 6 hours of creation");
    }

    // Update order status to cancelled
    order.orderStatus = "cancelled";
    order.updatedAt = new Date();
    await order.save();

    return order;
};

export const orderService = {
    createOrderService,
    getOrderByIdService,
    getOrdersByUserService,
    getAllOrdersService,
    updateOrderStatusService,
    cancelOrderService,
};
