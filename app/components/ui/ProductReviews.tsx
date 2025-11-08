"use client";

import { useState } from "react";
import {
  useReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/app/hooks/useReviews";
import { useAuth } from "@/app/hooks/useAuth";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "./button";
import ReviewModal from "./ReviewModal";
import {
  ICreateReviewData,
  IUpdateReviewData,
  IReview,
} from "@/app/types/review.type";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { Avatar, AvatarFallback } from "./avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground font-medium">Error loading reviews</p>
          <p className="text-muted-foreground text-sm mt-1">
            Please try refreshing the page
          </p>
        </CardContent>
      </Card>
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
          i < rating ? "text-yellow-500" : "text-muted"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
          {meta && meta.total > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Based on {meta.total} {meta.total === 1 ? "review" : "reviews"}
            </p>
          )}
        </div>
        {showAddButton && isAuthenticated && !userReview && (
          <Button onClick={handleAddReview} variant="outline">
            Write a Review
          </Button>
        )}
      </div>

      {/* Rating Summary */}
      {showSummary && meta && meta.total > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Average Rating */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold mb-2">
                  {meta.stats.averageRating.toFixed(1)}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(Math.round(meta.stats.averageRating), "lg")}
                </div>
                <p className="text-sm text-muted-foreground">
                  {meta.total} {meta.total === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count =
                    ratingDistribution[stars as keyof typeof ratingDistribution];
                  const percentage =
                    meta.total > 0 ? (count / meta.total) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium">{stars}</span>
                        <FaStar className="w-3 h-3 text-yellow-500" />
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User's Review */}
      {userReview && (
        <Card className="border-primary/50 bg-muted/30">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Your Review</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditReview(userReview)}
                    title="Edit review"
                  >
                    <FaEdit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(userReview)}
                    title="Delete review"
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {renderStars(userReview.rating, "md")}
                <span className="text-sm text-muted-foreground">
                  {new Date(userReview.createdAt).toLocaleDateString()}
                </span>
              </div>
              {userReview.title && (
                <h4 className="font-semibold text-foreground">
                  {userReview.title}
                </h4>
              )}
              <p className="text-muted-foreground leading-relaxed">
                {userReview.comment}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Reviews */}
      <div className="space-y-4">
        {otherReviews.map((review: IReview) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {review.user.firstName.charAt(0)}
                        {review.user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {review.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Verified Purchase
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {renderStars(review.rating, "sm")}
                  <span className="text-sm text-muted-foreground">
                    {review.rating}.0
                  </span>
                </div>

                {review.title && (
                  <h4 className="font-semibold text-foreground">
                    {review.title}
                  </h4>
                )}

                <p className="text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-foreground font-medium mb-2">No reviews yet</p>
              <p className="text-muted-foreground text-sm mb-4">
                Be the first to review this product!
              </p>
              {isAuthenticated && !userReview && (
                <Button onClick={handleAddReview} variant="outline">
                  Write the First Review
                </Button>
              )}
            </CardContent>
          </Card>
        )}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteReviewMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteReviewMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
