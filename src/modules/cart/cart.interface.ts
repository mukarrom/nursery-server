export type TCart = {
    userId: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
        total: number;
    }[];
    subtotal: number;
    total: number;
    createdAt: Date;
    updatedAt: Date;
};
