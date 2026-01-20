export type TReview = {
  userId: string;
  productId: string;
  rating: number;
  reviewText?: string;
  isPublished: boolean;
  helpfulCount?: number;
  createdAt: Date;
  updatedAt: Date;
};
