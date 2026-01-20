export type TFlashSale = {
    title: string;
    description?: string;
    image: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    productIds?: string[];
    featured?: boolean;
    order?: number;
    createdAt: Date;
    updatedAt: Date;
};
