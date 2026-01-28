export type TTransaction = {
    transactionId: string;
    orderId: string;
    userId: string;
    paymentMethodId: string;
    amount: number;
    transactionStatus: "pending" | "completed" | "failed" | "cancelled";
    userProvidedTransactionId: string;
    adminNotes?: string;
    createdAt: Date;
    updatedAt: Date;
};
