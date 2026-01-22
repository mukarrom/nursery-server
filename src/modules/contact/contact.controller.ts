import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { contactService } from "./contact.service";

// Create contact (Admin)
export const createContactController = catchAsync(async (req: Request, res: Response) => {
    const result = await contactService.createContactService(req.body);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Contact created successfully",
        data: result,
    });
});

// Get all contacts (Admin)
export const getAllContactsController = catchAsync(async (req: Request, res: Response) => {
    const result = await contactService.getAllContactsService();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Contacts retrieved successfully",
        data: result,
    });
});

// Get active contacts (Public)
export const getActiveContactsController = catchAsync(async (req: Request, res: Response) => {
    const result = await contactService.getActiveContactsService();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Contact methods retrieved successfully",
        data: result,
    });
});

// Get contact by ID (Admin)
export const getContactByIdController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await contactService.getContactByIdService(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Contact retrieved successfully",
        data: result,
    });
});

// Update contact (Admin)
export const updateContactController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await contactService.updateContactService(id as string, req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Contact updated successfully",
        data: result,
    });
});

// Delete contact (Admin)
export const deleteContactController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await contactService.deleteContactService(id as string);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Contact deleted successfully",
        data: result,
    });
});

export const contactController = {
    createContactController,
    getAllContactsController,
    getActiveContactsController,
    getContactByIdController,
    updateContactController,
    deleteContactController,
};
