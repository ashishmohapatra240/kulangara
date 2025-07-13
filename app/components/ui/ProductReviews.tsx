"use client";

import { useState } from "react";
import {
  useReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/app/hooks/useReviews";
import { useAuth } from "@/app/hooks/useAuth";
import { FaStar, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import Button from "./Button";
import ReviewModal from "./ReviewModal";
import {
  ICreateReviewData,
  IUpdateReviewData,
  IReview,
} from "@/app/types/review.type";

interface ProductReviewsProps {
  productId: string;
  showSummary?: boolean;
  showAddButton?: boolean;
}

export default function ProductReviews({
  productId,
  showSummary = true,
  showAddButton = true,
}: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const { data: reviewsData, isLoading, error } = useReviews(productId);

  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<IReview | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<IReview | null>(null);

  if (isLoading) {
    return (
      <div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 w-48 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 w-32 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b pb-6 last:border-b-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-6 bg-gray-200 w-32 rounded animate-pulse"></div>
                    <div className="h-5 bg-gray-200 w-24 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 w-24 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 w-full rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 w-3/4 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="text-center py-8">
          <div className="text-gray-600 mb-2">⚠️</div>
          <p className="text-gray-600 font-medium">Error loading reviews</p>
          <p className="text-gray-500 text-sm mt-1">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const { reviews, meta } = reviewsData || { reviews: [], meta: null };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`${sizeClasses[size]} ${
          i < rating ? "text-yellow-400" : "text-gray-200"
        }`}
      />
    ));
  };

  const handleAddReview = () => {
    setEditingReview(null);
    setIsModalOpen(true);
  };

  const handleEditReview = (review: IReview) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (review: IReview) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (reviewToDelete) {
      deleteReviewMutation.mutate({ productId, reviewId: reviewToDelete.id });
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const handleSubmitReview = (data: ICreateReviewData | IUpdateReviewData) => {
    if (editingReview) {
      updateReviewMutation.mutate({
        productId,
        reviewId: editingReview.id,
        data: data as IUpdateReviewData,
      });
    } else {
      createReviewMutation.mutate({
        productId,
        data: data as ICreateReviewData,
      });
    }
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const userReview = reviews.find(
    (review: IReview) => review.userId === user?.id
  );
  const otherReviews = reviews.filter(
    (review: IReview) => review.userId !== user?.id
  );

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review: IReview) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            {showSummary && meta && (
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {renderStars(Math.round(meta.stats.averageRating), "lg")}
                </div>
                <div className="text-left">
                  <span className="text-2xl font-bold text-gray-900">
                    {meta.stats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">out of 5</span>
                  <div className="text-sm text-gray-600">
                    {meta.total} {meta.total === 1 ? "review" : "reviews"}
                  </div>
                </div>
              </div>
            )}
          </div>
          {showAddButton && isAuthenticated && !userReview && (
            <Button
              onClick={handleAddReview}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              Write a Review
            </Button>
          )}
        </div>

        {/* Rating Distribution */}
        {showSummary && meta && (
          <div className="bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Rating Breakdown
            </h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count =
                  ratingDistribution[stars as keyof typeof ratingDistribution];
                const percentage =
                  meta.total > 0 ? (count / meta.total) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium">{stars}</span>
                      <FaStar className="w-3 h-3 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* User's Review */}
        {userReview && (
          <div className="bg-gray-50 p-6 border border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">Your Review</h3>
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    You
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditReview(userReview)}
                    className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100"
                    title="Edit review"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(userReview)}
                    className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100"
                    title="Delete review"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {renderStars(userReview.rating, "md")}
                <span className="text-sm text-gray-600">
                  {new Date(userReview.createdAt).toLocaleDateString()}
                </span>
              </div>
              {userReview.title && (
                <h4 className="font-semibold text-gray-900">
                  {userReview.title}
                </h4>
              )}
              <p className="text-gray-700 leading-relaxed">
                {userReview.comment}
              </p>
            </div>
          </div>
        )}

        {/* Other Reviews */}
        <div className="space-y-6">
          {otherReviews.map((review: IReview) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-800 font-semibold">
                      {review.user.firstName.charAt(0)}
                      {review.user.lastName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        {review.user.firstName} {review.user.lastName}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {review.isVerified && (
                          <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full font-medium">
                            ✓ Verified Purchase
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {renderStars(review.rating, "md")}
                  <span className="text-sm text-gray-600">
                    {review.rating} out of 5
                  </span>
                </div>

                {review.title && (
                  <h4 className="font-semibold text-gray-900">
                    {review.title}
                  </h4>
                )}

                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">📝</div>
              <p className="text-gray-600 font-medium">No reviews yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Be the first to review this product!
              </p>
              {isAuthenticated && !userReview && (
                <Button
                  onClick={handleAddReview}
                  className="mt-4"
                  variant="outline"
                >
                  Write the First Review
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productId={productId}
        review={editingReview}
        onSubmit={handleSubmitReview}
        isLoading={
          createReviewMutation.isPending || updateReviewMutation.isPending
        }
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20 bg-opacity-50 backdrop-blur-sm"
            onClick={handleDeleteCancel}
          />
          <div className="relative bg-white shadow-2xl max-w-md w-full border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Review
                </h3>
                <button
                  onClick={handleDeleteCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete your review? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteConfirm}
                  disabled={deleteReviewMutation.isPending}
                  className="flex-1"
                >
                  {deleteReviewMutation.isPending
                    ? "Deleting..."
                    : "Delete Review"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeleteCancel}
                  disabled={deleteReviewMutation.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
