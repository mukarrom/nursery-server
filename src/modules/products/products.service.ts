import QueryBuilder from "../../builder/QueryBuilder";
import { FOLDER_NAMES } from "../../constants/folder.constants";
import { deleteImage, uploadImage } from "../../utils/imageUpload";
import { TProduct } from "./products.interface";
import { ProductModel } from "./products.model";

/**
 * Create a new product
 * @param productData - The product data to create
 * @returns The created product
 */
const createProductService = async (productData: TProduct) => {
    // tags normalization to lowercase and coma separation
    if (productData.tags && !Array.isArray(productData.tags)) {
        productData.tags = (productData.tags as string)
            .split(",")
            .map((tag: string) => tag.trim().toLowerCase());
    }
    const result = await ProductModel.create(productData);

    if (!result && productData.image) {
        try {
            await deleteImage(productData.image);
        } catch (error) {
            console.error("Failed to cleanup product image:", error);
        }
        throw new Error("Failed to create product");
    }

    return result;
};

/**
 * Get a product by ID
 * @param id - The ID of the product to retrieve
 * @returns The product with the specified ID
 */
const getProductByIdService = async (id: string) => {
    return await ProductModel.findById(id);
};

/**
 * Get all products
 * @param query - The query parameters to filter, sort, and paginate the results
 * @queries: {searchTerm: string, brand: string, tags: string, price: string, rating: string, stock: string}
 * @returns An object containing the products and pagination metadata
 */
const getAllProductsService = async (query: Record<string, unknown>) => {

    const productQuery = new QueryBuilder(ProductModel.find({}), query)
        .search(["name", "description", "brand", "sku", "tags"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const products = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return { products, meta };
};

/**
 * Get products by tag name
 * @param tags - The tag name to filter products by
 * @param query - The query parameters to filter, sort, and paginate the results
 * @returns An object containing the products and pagination metadata
 */
const getProductsByTagService = async (tags: string, query: Record<string, unknown> = {}) => {
    // Split tags by comma, trim whitespace, and create case-insensitive regex for each
    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const tagsRegexArray = tagArray.map(t => new RegExp(`^${t}$`, 'i'));

    // Create base query with tag filtering
    const productQuery = new QueryBuilder(
        ProductModel.find({
            tags: {
                $in: tagsRegexArray
            }
        }),
        query
    )
        .search(["name", "description", "brand", "sku"])
        .filter()
        .sort()
        .paginate()
        .fields();

    const products = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();

    return { products, meta };
};

/**
 * Get all products by category id
 * @param categoryId - The ID of the category to retrieve products from
 * @returns An object containing the products and pagination metadata
 */
const getAllProductsByCategoryIdService = async (categoryId: string, query: Record<string, unknown> = {}) => {
    const productQuery = new QueryBuilder(ProductModel.find({ categoryId }), query)
        .search(["name", "description", "brand", "sku"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const products = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return { products, meta };
};

/**
 * Update a product by ID
 * @param id - The ID of the product to update
 * @param productData - The product data to update
 * @returns The updated product
 */
const updateProductService = async (
    id: string,
    productData: Partial<TProduct> & {
        file?: Express.Multer.File;
        files?: { [fieldname: string]: Express.Multer.File[] };
    }
) => {
    const session = await ProductModel.startSession();
    session.startTransaction();

    try {
        const existingProduct = await ProductModel.findById(id).session(session);

        if (!existingProduct) {
            throw new Error("Product not found");
        }

        let imageUrl = existingProduct.image;
        let imagesUrls = existingProduct.images || [];

        // Handle multiple file uploads
        if (productData.files) {
            const files = productData.files;

            // Handle main image update
            if (files.image && files.image[0]) {
                if (existingProduct.image) {
                    try {
                        await deleteImage(existingProduct.image);
                    } catch (error) {
                        console.error("Failed to delete old product image:", error);
                    }
                }

                const uploadResult = await uploadImage(
                    files.image[0].buffer,
                    FOLDER_NAMES.PRODUCT
                );
                imageUrl = uploadResult.url;
            }

            // Handle additional images
            if (files.images) {
                // Delete old additional images if any
                if (existingProduct.images && existingProduct.images.length > 0) {
                    for (const oldImage of existingProduct.images) {
                        try {
                            await deleteImage(oldImage);
                        } catch (error) {
                            console.error("Failed to delete old additional image:", error);
                        }
                    }
                }

                // Upload new additional images
                const newImagesUrls: string[] = [];
                for (const file of files.images) {
                    const uploadResult = await uploadImage(
                        file.buffer,
                        FOLDER_NAMES.PRODUCT
                    );
                    newImagesUrls.push(uploadResult.url);
                }
                imagesUrls = newImagesUrls;
            }

            delete productData.files;
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { ...productData, image: imageUrl, images: imagesUrls },
            { new: true, session }
        );

        await session.commitTransaction();
        return updatedProduct;
    } catch (error) {
        await session.abortTransaction();
        console.error("Failed to update product:", error);
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Delete a product by ID
 * @param id - The ID of the product to delete
 * @returns The deleted product
 */
const deleteProductService = async (id: string) => {
    const session = await ProductModel.startSession();
    session.startTransaction();

    try {
        const product = await ProductModel.findById(id).session(session);

        if (!product) {
            throw new Error("Product not found");
        }

        const result = await ProductModel.findByIdAndDelete(id).session(session);

        if (result && product.image) {
            const deleteResult = await deleteImage(product.image);
            if (!deleteResult || deleteResult.result !== "ok") {
                throw new Error("Failed to verify image deletion from Cloudinary");
            }
        }

        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        console.error("Failed to delete product:", error);
        throw error;
    } finally {
        session.endSession();
    }
};

export const productService = {
    createProductService,
    getProductByIdService,
    getAllProductsService,
    getProductsByTagService,
    getAllProductsByCategoryIdService,
    updateProductService,
    deleteProductService,
};
