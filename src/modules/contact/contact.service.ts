import AppError from "../../errors/AppError";
import { TContact } from "./contact.interface";
import { ContactModel } from "./contact.model";

// Create contact
export const createContactService = async (data: TContact) => {
    const contact = await ContactModel.create(data);
    return contact;
};

// Get all contacts (admin)
export const getAllContactsService = async () => {
    const contacts = await ContactModel.find().sort({ displayOrder: 1 });
    return contacts;
};

// Get active contacts (public)
export const getActiveContactsService = async () => {
    const contacts = await ContactModel.find({ isActive: true }).sort({ displayOrder: 1 });
    return contacts;
};

// Get contact by ID
export const getContactByIdService = async (id: string) => {
    const contact = await ContactModel.findById(id);
    if (!contact) {
        throw new AppError(404, "Contact not found");
    }
    return contact;
};

// Update contact
export const updateContactService = async (id: string, updateData: Partial<TContact>) => {
    const contact = await ContactModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!contact) {
        throw new AppError(404, "Contact not found");
    }
    return contact;
};

// Delete contact
export const deleteContactService = async (id: string) => {
    const contact = await ContactModel.findByIdAndDelete(id);
    if (!contact) {
        throw new AppError(404, "Contact not found");
    }
    return contact;
};

export const contactService = {
    createContactService,
    getAllContactsService,
    getActiveContactsService,
    getContactByIdService,
    updateContactService,
    deleteContactService,
};
