import { Request, Response } from "express";
import httpStatus from "http-status";
import { FOLDER_NAMES } from "../../constants/folder.constants";
import catchAsync from "../../utils/catchAsync";
import { uploadImage } from "../../utils/imageUpload";
import sendResponse from "../../utils/sendResponse";
import { TCategory } from "./category.interface";
import { categoryService } from "./category.service";

const createCategoryController = catchAsync(async (req, res) => {
    if (!req.file) {
        throw new Error("image is required");
    }

    if (!(req.file.buffer instanceof Buffer)) {
        throw new Error("Invalid file format");
    }

    const uploadResult = await uploadImage(
        req.file.buffer,
        FOLDER_NAMES.CATEGORY
    );

    const categoryData = {
        ...req.body,
        image: uploadResult.url,
    } as TCategory;

    const result = await categoryService.createCategoryService(categoryData);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Category created successfully",
        data: result,
    });
});

const getCategoryByIdController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const result = await categoryService.getCategoryByIdService(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Category retrieved successfully",
            data: result,
        });
    }
);

const getAllCategoriesController = catchAsync(
    async (req: Request, res: Response) => {
        const result = await categoryService.getAllCategoriesService(req.query);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Categories retrieved successfully",
            data: result.categories,
            meta: result.meta,
        });
    }
);

const updateCategoryController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const { title, description } = req.body;

        const updateData: Partial<TCategory> & { file?: Express.Multer.File } = {
            ...(title && { title }),
            ...(description && { description }),
        };

        if (req.file) {
            updateData.file = req.file;
        }

        const result = await categoryService.updateCategoryService(id, updateData);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Category updated successfully",
            data: result,
        });
    }
);

const deleteCategoryController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const result = await categoryService.deleteCategoryService(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Category deleted successfully",
            data: result,
        });
    }
);

export const categoryController = {
    createCategoryController,
    getCategoryByIdController,
    getAllCategoriesController,
    updateCategoryController,
    deleteCategoryController,
};
