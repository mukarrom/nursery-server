import { Request, Response } from "express";
import httpStatus from "http-status";
import { FOLDER_NAMES } from "../../constants/folder.constants";
import catchAsync from "../../utils/catchAsync";
import { uploadImage } from "../../utils/imageUpload";
import sendResponse from "../../utils/sendResponse";
import { TCarousel } from "./carousel.interface";
import { carouselService } from "./carousel.service";

/**
 * Controller to create a new carousel.
 * @param req - The request object containing the carousel data.
 * @param res - The response object to send the result.
 */
const createCarouselController = catchAsync(async (req, res) => {
    if (!req.file) {
        throw new Error("Image is required");
    }

    if (!(req.file.buffer instanceof Buffer)) {
        throw new Error("Invalid file format");
    }

    const uploadResult = await uploadImage(
        req.file.buffer,
        FOLDER_NAMES.CAROUSEL
    );

    const carouselData = {
        ...req.body,
        image: uploadResult.url,
    } as TCarousel;

    const result = await carouselService.createCarouselService(carouselData);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Carousel created successfully",
        data: result,
    });
});

const getCarouselByIdController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const result = await carouselService.getCarouselByIdService(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Carousel retrieved successfully",
            data: result,
        });
    }
);

const getAllCarouselsController = catchAsync(
    async (req: Request, res: Response) => {
        const result = await carouselService.getAllCarouselsService();

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Carousels retrieved successfully",
            data: result,
        });
    }
);

const getActiveCarouselsController = catchAsync(
    async (req: Request, res: Response) => {
        const result = await carouselService.getActiveCarouselsService();

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Active carousels retrieved successfully",
            data: result,
        });
    }
);

const updateCarouselController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const { title, description, isActive, order } = req.body;

        const updateData: Partial<TCarousel> & { file?: Express.Multer.File } = {
            ...(title && { title }),
            ...(description && { description }),
            ...(isActive !== undefined && { isActive: isActive === "true" || isActive === true }),
            ...(order !== undefined && { order: Number(order) }),
        };

        if (req.file) {
            updateData.file = req.file;
        }

        const result = await carouselService.updateCarouselService(id, updateData);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Carousel updated successfully",
            data: result,
        });
    }
);

const deleteCarouselController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const result = await carouselService.deleteCarouselService(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Carousel deleted successfully",
            data: result,
        });
    }
);

export const carouselController = {
    createCarouselController,
    getCarouselByIdController,
    getAllCarouselsController,
    getActiveCarouselsController,
    updateCarouselController,
    deleteCarouselController,
};
