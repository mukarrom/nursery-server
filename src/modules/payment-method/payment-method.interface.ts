export type TPaymentMethod = {
    methodName: string;
    description?: string;
    accountNumber?: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
};
