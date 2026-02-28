"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RatingWidgetProps {
  postId: string;
  initialRating?: number;
  averageRating?: number;
  totalRatings?: number;
}

export function RatingWidget({
  postId,
  initialRating,
  averageRating: initialAverage = 0,
  totalRatings: initialTotal = 0,
}: RatingWidgetProps) {
  const { data: session } = useSession();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [userRating, setUserRating] = useState(initialRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(initialAverage);
  const [totalRatings, setTotalRatings] = useState(initialTotal);

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
        const oldRating = userRating;
        setUserRating(rating);

        // Recalculate average
        if (oldRating === 0) {
          // New rating
          const newTotal = totalRatings + 1;
          const newAverage = (averageRating * totalRatings + rating) / newTotal;
          setAverageRating(newAverage);
          setTotalRatings(newTotal);
        } else {
          // Update existing rating
          const newAverage =
            (averageRating * totalRatings - oldRating + rating) / totalRatings;
          setAverageRating(newAverage);
        }
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAverageStar = (position: number) => {
    const fillPercentage = Math.max(
      0,
      Math.min(100, (averageRating - position + 1) * 100),
    );

    return (
      <div key={`avg-${position}`} className="relative inline-block">
        {/* Background (empty) star */}
        <Star className="w-6 h-6 text-gray-300 dark:text-gray-600" />

        {/* Foreground (filled) star */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
        </div>
      </div>
    );
  };

  if (!session) {
    return (
      <div className="text-center py-8 space-y-4">
        {totalRatings > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => renderAverageStar(star))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-lg">
                {averageRating.toFixed(1)}
              </span>{" "}
              av 5 ({totalRatings} {totalRatings === 1 ? "röst" : "röster"})
            </p>
          </div>
        )}
        <p className="text-muted-foreground mb-4">
          Logga in för att rösta på detta inlägg
        </p>
        <Button asChild>
          <Link href="/auth/signin">Logga in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Rating Section */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-3">Din röst:</p>
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
                className={cn(
                  "w-8 h-8 transition-colors",
                  star <= (hoveredStar || userRating)
                    ? "fill-amber-400 stroke-amber-400"
                    : "stroke-gray-300 dark:stroke-gray-600",
                )}
              />
            </button>
          ))}
        </div>
        {userRating > 0 ? (
          <p className="text-sm text-muted-foreground">
            Du röstade {userRating} stjärnor (klicka för att ändra)
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Klicka på stjärnorna för att rösta
          </p>
        )}
      </div>

      {/* Average Rating Display */}
      {totalRatings > 0 && (
        <div className="text-center pt-6 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Genomsnittlig röst:
          </p>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => renderAverageStar(star))}
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-lg">
              {averageRating.toFixed(1)}
            </span>{" "}
            av 5 ({totalRatings} {totalRatings === 1 ? "röst" : "röster"})
          </p>
        </div>
      )}
    </div>
  );
}
