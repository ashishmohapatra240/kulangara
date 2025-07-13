"use client";

import { FaStar } from "react-icons/fa";

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  className?: string;
}

export default function ReviewSummary({
  averageRating,
  totalReviews,
  className = "",
}: ReviewSummaryProps) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-3 h-3 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {renderStars(Math.round(averageRating))}
      </div>
      <span className="text-xs text-gray-600">
        ({totalReviews})
      </span>
    </div>
  );
} 