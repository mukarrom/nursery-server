import AppError from "../../errors/AppError";
import { TPaymentMethod } from "./payment-method.interface";
import { PaymentMethodModel } from "./payment-method.model";

export const createPaymentMethodService = async (data: TPaymentMethod) => {
    const result = await PaymentMethodModel.create(data);
    return result;
};

export const getPaymentMethodByIdService = async (id: string) => {
    const result = await PaymentMethodModel.findById(id);
    if (!result) {
        throw new AppError(404, "Payment method not found");
    }
    return result;
};

export const getAllPaymentMethodsService = async () => {
    const result = await PaymentMethodModel.find().sort({ displayOrder: 1, createdAt: -1 });
    return result;
};

export const getActivePaymentMethodsService = async () => {
    const result = await PaymentMethodModel.find({ isActive: true }).sort({ displayOrder: 1 });
    return result;
};

export const updatePaymentMethodService = async (
    id: string,
    updateData: Partial<TPaymentMethod>
) => {
    const result = await PaymentMethodModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError(404, "Payment method not found");
    }
    return result;
};

export const deletePaymentMethodService = async (id: string) => {
    const result = await PaymentMethodModel.findByIdAndDelete(id);
    if (!result) {
        throw new AppError(404, "Payment method not found");
    }
    return result;
};

export const paymentMethodService = {
    createPaymentMethodService,
    getPaymentMethodByIdService,
    getAllPaymentMethodsService,
    getActivePaymentMethodsService,
    updatePaymentMethodService,
    deletePaymentMethodService,
};
