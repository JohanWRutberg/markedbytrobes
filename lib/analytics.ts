// Google Analytics Event Tracking

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>,
    ) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// Generic event tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific event trackers

// Track affiliate link clicks
export const trackAffiliateClick = (
  bookTitle: string,
  bookAuthor: string,
  amazonLink: string,
) => {
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
  trackEvent(
    "reading_milestone",
    "Engagement",
    `${postSlug} - ${milestone}%`,
    milestone,
  );
};

// Track comments
export const trackComment = (postSlug: string, isReply: boolean = false) => {
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
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_location: url,
      page_title: title,
    });
  }
};
