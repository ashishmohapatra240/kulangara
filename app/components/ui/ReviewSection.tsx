"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useAuth } from "@/app/hooks/useAuth";
import {
  useReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/app/hooks/useReviews";
import {
  IReview,
  ICreateReviewData,
  IUpdateReviewData,
} from "@/app/types/review.type";
import Button from "./Button";

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<IReview | null>(null);
  const [formData, setFormData] = useState<ICreateReviewData>({
    rating: 5,
    title: "",
    comment: "",
  });

  // Hooks
  const { data: reviewsData, isLoading, error } = useReviews(productId);
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  // Check if user has already reviewed this product
  const userReview = reviewsData?.reviews.find(
    (review: IReview) => review.userId === user?.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingReview) {
      updateReviewMutation.mutate({
        productId,
        reviewId: editingReview.id,
        data: formData as IUpdateReviewData,
      });
      setEditingReview(null);
    } else {
      createReviewMutation.mutate({
        productId,
        data: formData,
      });
    }

    setShowReviewForm(false);
    setFormData({ rating: 5, title: "", comment: "" });
  };

  const handleEdit = (review: IReview) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      title: review.title || "",
      comment: review.comment,
    });
    setShowReviewForm(true);
  };

  const handleDelete = (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReviewMutation.mutate({ productId, reviewId });
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return <div className="mt-8">Loading reviews...</div>;
  }

  if (error) {
    return <div className="mt-8 text-red-600">Error loading reviews</div>;
  }

  const { reviews, meta } = reviewsData || { reviews: [], meta: null };

  return (
    <div className="mt-8">
      {/* Review Summary */}
      {meta && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(meta.stats.averageRating))}
              <span className="text-lg font-semibold">
                {meta.stats.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-600">Based on {meta.total} reviews</span>
          </div>
        </div>
      )}

      {/* Review Form */}
      {isAuthenticated && !userReview && !showReviewForm && (
        <Button onClick={() => setShowReviewForm(true)} className="mb-6">
          Write a Review
        </Button>
      )}

      {showReviewForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingReview ? "Edit Review" : "Write a Review"}
          </h3>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star: number) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <FaStar
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Summary of your experience"
            />
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Review</label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              rows={4}
              placeholder="Share your experience with this product"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={
                createReviewMutation.isPending || updateReviewMutation.isPending
              }
            >
              {createReviewMutation.isPending || updateReviewMutation.isPending
                ? "Saving..."
                : editingReview
                ? "Update Review"
                : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowReviewForm(false);
                setEditingReview(null);
                setFormData({ rating: 5, title: "", comment: "" });
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review: IReview) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <span className="font-medium">
                      {review.user.firstName} {review.user.lastName}
                    </span>
                    {review.isVerified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {review.title && (
                    <h4 className="font-semibold mb-1">{review.title}</h4>
                  )}

                  <p className="text-gray-700 mb-2">{review.comment}</p>

                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Edit/Delete buttons for user's own review */}
                {user?.id === review.userId && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
