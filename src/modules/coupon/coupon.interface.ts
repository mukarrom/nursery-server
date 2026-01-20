export type TCoupon = {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    validFrom: Date;
    validUntil: Date;
    maxUses?: number;
    currentUses: number;
    minOrderAmount?: number;
    isActive: boolean;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
};
