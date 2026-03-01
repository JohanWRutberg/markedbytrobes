"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";

interface ViewTrackerProps {
  postId: string;
}

export function ViewTracker({ postId }: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      // Check if user has already viewed this post in the last 24 hours
      const viewedPosts = Cookies.get("viewed_posts");
      const viewedPostsArray = viewedPosts ? JSON.parse(viewedPosts) : [];

      if (!viewedPostsArray.includes(postId)) {
        // Track the view
        try {
          await fetch("/api/posts/track-view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId }),
          });

          // Add to viewed posts cookie (expires in 24 hours)
          viewedPostsArray.push(postId);
          Cookies.set("viewed_posts", JSON.stringify(viewedPostsArray), {
            expires: 1, // 1 day
          });
        } catch (error) {
          console.error("Failed to track view:", error);
        }
      }
    };

    trackView();
  }, [postId]);

  return null;
}
