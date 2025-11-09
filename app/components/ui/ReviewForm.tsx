"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
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
      newErrors["rating"] = "Please select a rating";
    }

    if (!comment.trim()) {
      newErrors["comment"] = "Please write a review comment";
    } else if (comment.trim().length < 10) {
      newErrors["comment"] = "Review must be at least 10 characters long";
    }

    if (title.trim() && title.trim().length < 3) {
      newErrors["title"] = "Title must be at least 3 characters long";
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
            isFilled ? "text-yellow-500" : "text-muted"
          } hover:scale-110 hover:text-yellow-400`}
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
      {/* Rating Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Your Rating</Label>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">{renderStars()}</div>
          {(hoverRating || rating) > 0 && (
            <span className="text-sm font-medium text-muted-foreground">
              {getRatingText()}
            </span>
          )}
        </div>
        {errors["rating"] && (
          <p className="text-sm text-destructive">{errors["rating"]}</p>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Review Title (Optional)</Label>
        <Input
          id="title"
          type="text"
          placeholder="Sum up your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        {errors["title"] && (
          <p className="text-sm text-destructive">{errors["title"]}</p>
        )}
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Label htmlFor="comment">Your Review</Label>
        <Textarea
          id="comment"
          placeholder="Share your thoughts about this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isLoading}
          rows={5}
          className="resize-none"
        />
        {errors["comment"] && (
          <p className="text-sm text-destructive">{errors["comment"]}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Submitting..."
            : isEditing
            ? "Update Review"
            : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
