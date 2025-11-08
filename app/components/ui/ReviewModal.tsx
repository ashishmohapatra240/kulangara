"use client";

import ReviewForm from "./ReviewForm";
import {
  ICreateReviewData,
  IUpdateReviewData,
  IReview,
} from "@/app/types/review.type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  review?: IReview | null;
  onSubmit: (data: ICreateReviewData | IUpdateReviewData) => void;
  isLoading?: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  productId,
  review,
  onSubmit,
  isLoading = false,
}: ReviewModalProps) {
  const isEditing = !!review;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Your Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your thoughts about this product"
              : "Share your experience with this product"}
          </DialogDescription>
        </DialogHeader>
        <ReviewForm
          productId={productId}
          review={review}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
