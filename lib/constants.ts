export const CATEGORIES = [
  { value: "ROMANCE", label: "Romance" },
  { value: "ROMANTASY", label: "Romantasy" },
  { value: "FANTASY", label: "Fantasy" },
  { value: "DARK_ROMANCE", label: "Dark Romance" },
  { value: "THRILLER", label: "Thriller" },
  { value: "BOOK_LISTS", label: "Book lists" },
  { value: "SEASONAL_READS", label: "Seasonal reads" },
  { value: "FICTION", label: "Fiction" },
  { value: "HISTORICAL_FICTION", label: "Historical-fiction" },
  { value: "CONTEMPORARY", label: "Contemporary" },
  { value: "HISTORICAL", label: "Historical" },
  { value: "SPORTS_ROMANCE", label: "Sports-romance" },
] as const;

export const POSTS_PER_PAGE = 8;

export const SITE_CONFIG = {
  name: "Marked by Trobes",
  description: "Book reviews and recommendations for passionate readers",
  url: "https://markedbytrobes.com",
  tagline: "Discovering books that leave their mark",
};
