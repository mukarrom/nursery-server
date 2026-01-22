import QueryBuilder from "../../builder/QueryBuilder";
import { FOLDER_NAMES } from "../../constants/folder.constants";
import { deleteImage, uploadImage } from "../../utils/imageUpload";
import { TProduct } from "./products.interface";
import { ProductModel } from "./products.model";

const createProductService = async (productData: TProduct) => {
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

const getProductByIdService = async (id: string) => {
    return await ProductModel.findById(id);
};

const getAllProductsService = async (query: Record<string, unknown>) => {
    const productQuery = new QueryBuilder(ProductModel.find({}), query)
        .search(["name", "description", "brand", "sku"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const products = await productQuery.modelQuery;
    const meta = await productQuery.countTotal();
    return { products, meta };
};

const updateProductService = async (
    id: string,
    productData: Partial<TProduct> & { file?: Express.Multer.File }
) => {
    const session = await ProductModel.startSession();
    session.startTransaction();

    try {
        const existingProduct = await ProductModel.findById(id).session(session);

        if (!existingProduct) {
            throw new Error("Product not found");
        }

        let imageUrl = existingProduct.image;

        if (productData.file) {
            if (existingProduct.image) {
                try {
                    await deleteImage(existingProduct.image);
                } catch (error) {
                    console.error("Failed to delete old product image:", error);
                }
            }

            const uploadResult = await uploadImage(
                productData.file.buffer,
                FOLDER_NAMES.PRODUCT
            );
            imageUrl = uploadResult.url;
            delete productData.file;
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { ...productData, image: imageUrl },
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
    updateProductService,
    deleteProductService,
};
