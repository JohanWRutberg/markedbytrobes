"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostLikeButtonProps {
  postId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
}

export function PostLikeButton({
  postId,
  initialLikeCount,
  initialIsLiked,
}: PostLikeButtonProps) {
  const { data: session } = useSession();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/auth/signin">
            <Heart className="w-4 h-4 mr-2" />
            Sign in to like
          </Link>
        </Button>
        {likeCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isLiked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          isLiked && "bg-red-500 hover:bg-red-600 text-white border-red-500",
        )}
      >
        <Heart className={cn("w-4 h-4 mr-2", isLiked && "fill-current")} />
        {isLiked ? "Liked" : "Like"}
      </Button>
      {likeCount > 0 && (
        <span className="text-sm text-muted-foreground">
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
      )}
    </div>
  );
}
