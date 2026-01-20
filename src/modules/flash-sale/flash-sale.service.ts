import { FOLDER_NAMES } from "../../constants/folder.constants";
import { deleteImage, uploadImage } from "../../utils/imageUpload";
import { TFlashSale } from "./flash-sale.interface";
import { FlashSaleModel } from "./flash-sale.model";

const createFlashSaleService = async (flashSaleData: TFlashSale) => {
    const result = await FlashSaleModel.create(flashSaleData);

    if (!result && flashSaleData.image) {
        try {
            await deleteImage(flashSaleData.image);
        } catch (error) {
            console.error("Failed to cleanup flash sale image:", error);
        }
        throw new Error("Failed to create flash sale");
    }

    return result;
};

const getFlashSaleByIdService = async (id: string) => {
    return await FlashSaleModel.findById(id).populate("productIds");
};

const getAllFlashSalesService = async () => {
    return await FlashSaleModel.find({}).sort({ order: 1, startDate: -1 }).populate("productIds");
};

const getActiveFlashSalesService = async () => {
    const now = new Date();
    return await FlashSaleModel.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
    })
        .sort({ order: 1, startDate: -1 })
        .populate("productIds");
};

const getFeaturedFlashSalesService = async () => {
    const now = new Date();
    return await FlashSaleModel.find({
        isActive: true,
        featured: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
    })
        .sort({ order: 1 })
        .populate("productIds");
};

const updateFlashSaleService = async (
    id: string,
    flashSaleData: Partial<TFlashSale> & { file?: Express.Multer.File }
) => {
    const session = await FlashSaleModel.startSession();
    session.startTransaction();

    try {
        const existingFlashSale = await FlashSaleModel.findById(id).session(session);

        if (!existingFlashSale) {
            throw new Error("Flash sale not found");
        }

        let imageUrl = existingFlashSale.image;

        if (flashSaleData.file) {
            if (existingFlashSale.image) {
                try {
                    await deleteImage(existingFlashSale.image);
                } catch (error) {
                    console.error("Failed to delete old flash sale image:", error);
                }
            }

            const uploadResult = await uploadImage(
                flashSaleData.file.buffer,
                FOLDER_NAMES.FLASHSALE
            );
            imageUrl = uploadResult.url;
            delete flashSaleData.file;
        }

        const updatedFlashSale = await FlashSaleModel.findByIdAndUpdate(
            id,
            { ...flashSaleData, image: imageUrl },
            { new: true, session }
        ).populate("productIds");

        await session.commitTransaction();
        return updatedFlashSale;
    } catch (error) {
        await session.abortTransaction();
        console.error("Failed to update flash sale:", error);
        throw error;
    } finally {
        session.endSession();
    }
};

const deleteFlashSaleService = async (id: string) => {
    const session = await FlashSaleModel.startSession();
    session.startTransaction();

    try {
        const flashSale = await FlashSaleModel.findById(id).session(session);

        if (!flashSale) {
            throw new Error("Flash sale not found");
        }

        const result = await FlashSaleModel.findByIdAndDelete(id).session(session);

        if (result && flashSale.image) {
            const deleteResult = await deleteImage(flashSale.image);
            if (!deleteResult || deleteResult.result !== "ok") {
                throw new Error("Failed to verify image deletion from Cloudinary");
            }
        }

        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        console.error("Failed to delete flash sale:", error);
        throw error;
    } finally {
        session.endSession();
    }
};

export const flashSaleService = {
    createFlashSaleService,
    getFlashSaleByIdService,
    getAllFlashSalesService,
    getActiveFlashSalesService,
    getFeaturedFlashSalesService,
    updateFlashSaleService,
    deleteFlashSaleService,
};
