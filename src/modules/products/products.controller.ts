import { Request, Response } from "express";
import httpStatus from "http-status";
import { FOLDER_NAMES } from "../../constants/folder.constants";
import catchAsync from "../../utils/catchAsync";
import { uploadImage } from "../../utils/imageUpload";
import sendResponse from "../../utils/sendResponse";
import { TProduct } from "./products.interface";
import { productService } from "./products.service";

/**
 * Create a new product
 * @param req - The request object
 * @param res - The response object
 */
const createProductController = catchAsync(async (req, res) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || (!files.image && !files.images)) {
        throw new Error("At least one image is required");
    }

    let mainImageUrl = "";
    const additionalImageUrls: string[] = [];

    // Upload main image
    if (files.image && files.image[0]) {
        const uploadResult = await uploadImage(
            files.image[0].buffer,
            FOLDER_NAMES.PRODUCT
        );
        mainImageUrl = uploadResult.url;
    }

    // Upload additional images
    if (files.images) {
        for (const file of files.images) {
            const uploadResult = await uploadImage(
                file.buffer,
                FOLDER_NAMES.PRODUCT
            );
            additionalImageUrls.push(uploadResult.url);
        }
    }

    // If no main image but has additional images, use first additional image as main
    if (!mainImageUrl && additionalImageUrls.length > 0) {
        mainImageUrl = additionalImageUrls.shift()!;
    }

    const productData = {
        ...req.body,
        image: mainImageUrl,
        ...(additionalImageUrls.length > 0 && { images: additionalImageUrls }),
    } as TProduct;

    const result = await productService.createProductService(productData);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Product created successfully",
        data: result,
    });
});

/**
 * Get a product by ID
 * @param req - The request object
 * @param res - The response object
 */
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

/**
 * Get all products
 * @param req - The request object
 * @param res - The response object
 */
const getAllProductsController = catchAsync(
    async (req: Request, res: Response) => {
        const result = await productService.getAllProductsService(req.query);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Products retrieved successfully",
            data: result.products,
            meta: result.meta,
        });
    }
);

/**
 * Get all products by category id
 * @param req - The request object
 * @param res - The response object
 */
const getAllProductsByCategoryIdController = catchAsync(
    async (req: Request, res: Response) => {
        const { categoryId } = req.params;
        const result = await productService.getAllProductsByCategoryIdService(categoryId as string);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Products retrieved successfully",
            data: result.products,
            meta: result.meta,
        });
    }
);

/**
 * Update a product by ID
 * @param req - The request object
 * @param res - The response object
 */
const updateProductController = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const { name, description, price, isAvailable, discount, quantity, isFeatured, sku, brand, categoryId, tags } = req.body;

        const updateData: Partial<TProduct> & {
            file?: Express.Multer.File;
            files?: { [fieldname: string]: Express.Multer.File[] };
        } = {
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

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files) {
            updateData.files = files;
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

/**
 * Delete a product by ID
 * @param req - The request object
 * @param res - The response object
 */
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
    getAllProductsByCategoryIdController,
    updateProductController,
    deleteProductController,
};
