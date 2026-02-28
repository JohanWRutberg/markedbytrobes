interface SchemaArticle {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
  };
  category: string;
}

export function generateArticleSchema(article: SchemaArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Marked by Trobes",
      logo: {
        "@type": "ImageObject",
        url: "https://markedbytrobes.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://markedbytrobes.com/blog/${article.title}`,
    },
  };
}

interface SchemaReview {
  itemName: string;
  author: string;
  ratingValue: number;
  bestRating: number;
  reviewBody: string;
  datePublished: string;
}

export function generateReviewSchema(review: SchemaReview) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Book",
      name: review.itemName,
      author: {
        "@type": "Person",
        name: review.author,
      },
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.ratingValue,
      bestRating: review.bestRating,
    },
    reviewBody: review.reviewBody,
    author: {
      "@type": "Organization",
      name: "Marked by Trobes",
    },
    datePublished: review.datePublished,
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Marked by Trobes",
    description: "Book reviews and recommendations for passionate readers",
    url: "https://markedbytrobes.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://markedbytrobes.com/blog?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}
