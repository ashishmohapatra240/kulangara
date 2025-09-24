"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import Button from "./Button";
import {
  ICreateReviewData,
  IUpdateReviewData,
  IReview,
} from "@/app/types/review.type";

interface ReviewFormProps {
  productId: string;
  review?: IReview | null;
  onSubmit: (data: ICreateReviewData | IUpdateReviewData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ReviewForm({
  review,
  onSubmit,
  onCancel,
  isLoading = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(review?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(review?.title || "");
  const [comment, setComment] = useState(review?.comment || "");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = !!review;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (!comment.trim()) {
      newErrors.comment = "Please write a review comment";
    } else if (comment.trim().length < 10) {
      newErrors.comment = "Review must be at least 10 characters long";
    }

    if (title.trim() && title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = {
      rating,
      comment: comment.trim(),
      ...(title.trim() && { title: title.trim() }),
    };

    onSubmit(formData);
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= (hoverRating || rating);

      return (
        <FaStar
          key={i}
          className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
            isFilled ? "text-yellow-400" : "text-gray-300"
          } hover:scale-110 hover:text-yellow-300`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
        />
      );
    });
  };

  const getRatingText = () => {
    const currentRating = hoverRating || rating;
    const ratingTexts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return ratingTexts[currentRating as keyof typeof ratingTexts] || "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Rating *
        </label>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            {renderStars()}
          </div>
          {rating > 0 && (
            <p className="text-lg font-semibold text-gray-900">
              {rating} out of 5 - {getRatingText()}
            </p>
          )}
          {errors.rating && (
            <p className="text-red-500 text-sm mt-2">{errors.rating}</p>
          )}
        </div>
      </div>

      {/* Title Section */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Title (optional)
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.title ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Brief summary of your experience"
          maxLength={100}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
          <span className="text-sm text-gray-500 ml-auto">
            {title.length}/100
          </span>
        </div>
      </div>

      {/* Comment Section */}
      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          Review *
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
            errors.comment ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Share your detailed experience with this product..."
          maxLength={1000}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.comment && (
            <p className="text-red-500 text-sm">{errors.comment}</p>
          )}
          <span className="text-sm text-gray-500 ml-auto">
            {comment.length}/1000
          </span>
        </div>
      </div>


      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 text-base font-semibold"
        >
          {isLoading
            ? "Saving..."
            : isEditing
            ? "Update Review"
            : "Submit Review"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-3 text-base font-semibold"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
