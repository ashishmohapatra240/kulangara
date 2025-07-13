"use client";

import { FaTimes } from "react-icons/fa";
import ReviewForm from "./ReviewForm";
import {
  ICreateReviewData,
  IUpdateReviewData,
  IReview,
} from "@/app/types/review.type";

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
  if (!isOpen) return null;

  const isEditing = !!review;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit Your Review" : "Write a Review"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isEditing
                ? "Update your thoughts about this product"
                : "Share your experience with this product"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <ReviewForm
            productId={productId}
            review={review}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
