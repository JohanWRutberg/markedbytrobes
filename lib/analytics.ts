// Google Analytics Event Tracking

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, string | number | boolean | string[]>,
    ) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// Check if tracking should be enabled
const shouldTrack = (): boolean => {
  // Don't track in development
  if (process.env.NODE_ENV === "development") {
    return false;
  }

  // Don't track if running on localhost
  if (typeof window !== "undefined") {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return false;
    }

    // Don't track admin users (check sessionStorage)
    try {
      const userRole = sessionStorage.getItem("userRole");
      if (userRole === "ADMIN") {
        return false;
      }
    } catch {
      // SessionStorage not available, continue with tracking
    }
  }

  return true;
};

// Generic event tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
) => {
  if (!shouldTrack()) return;

  if (typeof window !== "undefined" && window.gtag) {
    const config: Record<string, string | number | boolean | string[]> = {
      event_category: category,
    };

    if (label !== undefined) {
      config.event_label = label;
    }

    if (value !== undefined) {
      config.value = value;
    }

    window.gtag("event", action, config);
  }
};

// Specific event trackers

// Track affiliate link clicks
export const trackAffiliateClick = (
  bookTitle: string,
  bookAuthor: string,
  amazonLink: string,
) => {
  if (!shouldTrack()) return;

  trackEvent(
    "click_affiliate_link",
    "Affiliate",
    `${bookTitle} - ${bookAuthor}`,
  );

  // Also track as a specific affiliate event for better reporting
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "affiliate_click", {
      book_title: bookTitle,
      book_author: bookAuthor,
      link_url: amazonLink,
    });
  }
};

// Track blog post reading
export const trackPostRead = (
  postTitle: string,
  postSlug: string,
  category: string,
  scrollPercentage: number,
) => {
  if (!shouldTrack()) return;

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "post_read", {
      post_title: postTitle,
      post_slug: postSlug,
      post_category: category,
      scroll_percentage: scrollPercentage,
    });
  }
};

// Track post engagement milestones
export const trackReadingMilestone = (
  postSlug: string,
  milestone: 25 | 50 | 75 | 100,
) => {
  if (!shouldTrack()) return;

  trackEvent(
    "reading_milestone",
    "Engagement",
    `${postSlug} - ${milestone}%`,
    milestone,
  );
};

// Track comments
export const trackComment = (postSlug: string, isReply: boolean = false) => {
  if (!shouldTrack()) return;

  trackEvent(
    isReply ? "submit_reply" : "submit_comment",
    "Engagement",
    postSlug,
  );

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "comment_submitted", {
      post_slug: postSlug,
      comment_type: isReply ? "reply" : "comment",
    });
  }
};

// Track ratings
export const trackRating = (
  postSlug: string,
  rating: number,
  isUpdate: boolean = false,
) => {
  if (!shouldTrack()) return;

  trackEvent(
    isUpdate ? "update_rating" : "submit_rating",
    "Engagement",
    postSlug,
    rating,
  );

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "rating_submitted", {
      post_slug: postSlug,
      rating_value: rating,
      action_type: isUpdate ? "update" : "new",
    });
  }
};

// Track page views (for custom tracking beyond default GA)
export const trackPageView = (url: string, title: string) => {
  if (!shouldTrack()) return;

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_location: url,
      page_title: title,
    });
  }
};
