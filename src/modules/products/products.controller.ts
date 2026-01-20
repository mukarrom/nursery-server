import { Request, Response } from "express";
import httpStatus from "http-status";
import { FOLDER_NAMES } from "../../constants/folder.constants";
import catchAsync from "../../utils/catchAsync";
import { uploadImage } from "../../utils/imageUpload";
import sendResponse from "../../utils/sendResponse";
import { TProduct } from "./products.interface";
import { productService } from "./products.service";

const createProductController = catchAsync(async (req, res) => {
    if (!req.file) {
        throw new Error("imageFile is required");
    }

    if (!(req.file.buffer instanceof Buffer)) {
        throw new Error("Invalid file format");
    }

    const uploadResult = await uploadImage(
        req.file.buffer,
        FOLDER_NAMES.PRODUCT
    );

    const productData = {
        ...req.body,
        image: uploadResult.url,
    } as TProduct;

    const result = await productService.createProductService(productData);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Product created successfully",
        data: result,
    });
});

const getProductByIdController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const result = await productService.getProductByIdService(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Product retrieved successfully",
            data: result,
        });
    }
);

const getAllProductsController = catchAsync(
    async (req: Request, res: Response) => {
        const result = await productService.getAllProductsService();

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Products retrieved successfully",
            data: result,
        });
    }
);

const updateProductController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const { name, description, price, isAvailable, discount, quantity, isFeatured, sku, brand, categoryId, tags } = req.body;

        const updateData: Partial<TProduct> & { file?: Express.Multer.File } = {
            ...(name && { name }),
            ...(description && { description }),
            ...(price !== undefined && { price: Number(price) }),
            ...(discount !== undefined && { discount: Number(discount) }),
            ...(quantity !== undefined && { quantity: Number(quantity) }),
            ...(isAvailable !== undefined && { isAvailable: isAvailable === "true" || isAvailable === true }),
            ...(isFeatured !== undefined && { isFeatured: isFeatured === "true" || isFeatured === true }),
            ...(sku && { sku }),
            ...(brand && { brand }),
            ...(categoryId && { categoryId }),
            ...(tags && { tags: Array.isArray(tags) ? tags : [tags] }),
        };

        if (req.file) {
            updateData.file = req.file;
        }

        const result = await productService.updateProductService(id, updateData);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Product updated successfully",
            data: result,
        });
    }
);

const deleteProductController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const result = await productService.deleteProductService(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Product deleted successfully",
            data: result,
        });
    }
);

export const productController = {
    createProductController,
    getProductByIdController,
    getAllProductsController,
    updateProductController,
    deleteProductController,
};
