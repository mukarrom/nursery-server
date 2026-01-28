export type TContactType = "WhatsApp" | "Imo" | "Viber" | "Telegram" | "Phone" | "Email";

export type TContact = {
    label: string;
    contactType: TContactType;
    contactValue: string;
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
};
