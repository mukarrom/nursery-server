export type TProduct = {
    name: string;
    description?: string;
    image: string;
    images?: string[];
    price: number;
    discount?: number;
    quantity?: number;
    sku?: string;
    brand?: string;
    categoryId?: string;
    tags?: string[];
    isAvailable: boolean;
    isFeatured?: boolean;
    ratingAverage?: number;
    ratingCount?: number;
    createdAt: Date;
    updatedAt: Date;
};
