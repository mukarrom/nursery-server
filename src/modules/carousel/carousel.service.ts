import { FOLDER_NAMES } from "../../constants/folder.constants";
import { deleteImage, uploadImage } from "../../utils/imageUpload";
import { TCarousel } from "./carousel.interface";
import { CarouselModel } from "./carousel.model";

const createCarouselService = async (carouselData: TCarousel) => {
    const result = await CarouselModel.create(carouselData);

    if (!result && carouselData.image) {
        try {
            await deleteImage(carouselData.image);
        } catch (error) {
            console.error("Failed to cleanup carousel image:", error);
        }
        throw new Error("Failed to create carousel");
    }

    return result;
};

const getCarouselByIdService = async (id: string) => {
    return await CarouselModel.findById(id);
};

const getAllCarouselsService = async () => {
    return await CarouselModel.find({}).sort({ order: 1 });
};

const getActiveCarouselsService = async () => {
    return await CarouselModel.find({ isActive: true }).sort({ order: 1 });
};

const updateCarouselService = async (
    id: string,
    carouselData: Partial<TCarousel> & { file?: Express.Multer.File }
) => {
    const session = await CarouselModel.startSession();
    session.startTransaction();

    try {
        const existingCarousel = await CarouselModel.findById(id).session(session);

        if (!existingCarousel) {
            throw new Error("Carousel not found");
        }

        let imageUrl = existingCarousel.image;

        if (carouselData.file) {
            if (existingCarousel.image) {
                try {
                    await deleteImage(existingCarousel.image);
                } catch (error) {
                    console.error("Failed to delete old carousel image:", error);
                }
            }

            const uploadResult = await uploadImage(
                carouselData.file.buffer,
                FOLDER_NAMES.CAROUSEL
            );
            imageUrl = uploadResult.url;
            delete carouselData.file;
        }

        const updatedCarousel = await CarouselModel.findByIdAndUpdate(
            id,
            { ...carouselData, image: imageUrl },
            { new: true, session }
        );

        await session.commitTransaction();
        return updatedCarousel;
    } catch (error) {
        await session.abortTransaction();
        console.error("Failed to update carousel:", error);
        throw error;
    } finally {
        session.endSession();
    }
};

const deleteCarouselService = async (id: string) => {
    const session = await CarouselModel.startSession();
    session.startTransaction();

    try {
        const carousel = await CarouselModel.findById(id).session(session);

        if (!carousel) {
            throw new Error("Carousel not found");
        }

        const result = await CarouselModel.findByIdAndDelete(id).session(session);

        if (result && carousel.image) {
            const deleteResult = await deleteImage(carousel.image);
            if (!deleteResult || deleteResult.result !== "ok") {
                throw new Error("Failed to verify image deletion from Cloudinary");
            }
        }

        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        console.error("Failed to delete carousel:", error);
        throw error;
    } finally {
        session.endSession();
    }
};

export const carouselService = {
    createCarouselService,
    getCarouselByIdService,
    getAllCarouselsService,
    getActiveCarouselsService,
    updateCarouselService,
    deleteCarouselService,
};
