"use client";

import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IReview } from "@/app/types/review.type";

interface ReviewActionsProps {
  review: IReview;
  onEdit: (review: IReview) => void;
  onDelete: (reviewId: string) => void;
  isDeleting?: boolean;
}

export default function ReviewActions({
  review,
  onEdit,
  onDelete,
  isDeleting = false,
}: ReviewActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(review.id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(review)}
          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
          title="Edit review"
        >
          <FaEdit className="w-3 h-3" />
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 transition-colors p-1 disabled:opacity-50"
          title="Delete review"
        >
          <FaTrash className="w-3 h-3" />
        </button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-[200px]">
          <p className="text-sm text-gray-700 mb-3">
            Are you sure you want to delete this review?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={handleDeleteCancel}
              disabled={isDeleting}
              className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 