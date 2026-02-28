"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface RatingWidgetProps {
  postId: string;
  initialRating?: number;
  averageRating?: number;
  totalRatings?: number;
}

export function RatingWidget({
  postId,
  initialRating,
  averageRating = 0,
  totalRatings = 0,
}: RatingWidgetProps) {
  const { data: session } = useSession();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [userRating, setUserRating] = useState(initialRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (rating: number) => {
    if (!session) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, rating }),
      });

      if (response.ok) {
        setUserRating(rating);
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground mb-4">Sign in to rate this post</p>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              disabled={isSubmitting}
              className="transition-transform hover:scale-110 disabled:opacity-50"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredStar || userRating)
                    ? "fill-yellow-400 stroke-yellow-400"
                    : "stroke-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        {userRating > 0 && (
          <p className="text-sm text-muted-foreground">
            You rated this {userRating} stars
          </p>
        )}
      </div>

      {totalRatings > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Average: {averageRating.toFixed(1)} stars ({totalRatings} ratings)
        </div>
      )}
    </div>
  );
}
