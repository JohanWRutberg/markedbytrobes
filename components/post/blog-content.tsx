"use client";

import { useEffect, useRef } from "react";
import { trackReadingMilestone } from "@/lib/analytics";

interface BlogContentProps {
  content: string;
  postSlug: string;
}

export function BlogContent({ content, postSlug }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const milestonesTracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const rect = element.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate scroll percentage
      const scrollTop = Math.max(0, -rect.top);
      const scrollableHeight = elementHeight - viewportHeight;
      const scrollPercentage = Math.min(
        100,
        Math.max(0, (scrollTop / scrollableHeight) * 100),
      );

      // Track milestones
      const milestones = [25, 50, 75, 100] as const;
      milestones.forEach((milestone) => {
        if (
          scrollPercentage >= milestone &&
          !milestonesTracked.current.has(milestone)
        ) {
          milestonesTracked.current.add(milestone);
          trackReadingMilestone(postSlug, milestone);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [postSlug]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg dark:prose-invert max-w-none mb-12 blog-content"
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning
    />
  );
}
