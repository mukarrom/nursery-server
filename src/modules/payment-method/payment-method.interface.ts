export type TPaymentMethod = {
    methodName: string;
    description?: string;
    accountNumber?: string;
    accountName?: string;
    accountType?: "Personal" | "Agent";
    instructions?: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
};
