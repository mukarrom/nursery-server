import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
    createAddressService,
    deleteAddressService,
    getAddressByIdService,
    getAddressesByUserService,
    setDefaultAddressService,
    updateAddressService,
} from "./address.service";

export const createAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { street, city, postalCode, country, phoneNumber, label, isDefault } = req.body;

    const address = await createAddressService(userId, {
        street,
        city,
        postalCode,
        country,
        phoneNumber,
        label,
        isDefault,
    });

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Address created successfully",
        data: address,
    });
});

export const getAddresses = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const addresses = await getAddressesByUserService(userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Addresses retrieved successfully",
        data: addresses,
    });
});

export const getAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { addressId } = req.params as { addressId: string };

    const address = await getAddressByIdService(addressId as string, userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Address retrieved successfully",
        data: address,
    });
});

export const updateAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { addressId } = req.params as { addressId: string };
    const updateData = req.body;

    const address = await updateAddressService(addressId as string, userId, updateData);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Address updated successfully",
        data: address,
    });
});

export const deleteAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { addressId } = req.params as { addressId: string };

    const address = await deleteAddressService(addressId as string, userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Address deleted successfully",
        data: address,
    });
});

export const setDefaultAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { addressId } = req.params as { addressId: string };

    const address = await setDefaultAddressService(addressId as string, userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Default address set successfully",
        data: address,
    });
});

export const addressController = {
    createAddress,
    getAddresses,
    getAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
};
