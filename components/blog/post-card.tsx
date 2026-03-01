"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatDate, readingTime } from "@/lib/text-utils";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    featuredImage?: string | null;
    publishedAt: Date | string | null;
    category: string;
    author: {
      name: string | null;
    };
    content: string;
  };
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const categoryColors: Record<string, string> = {
    ROMANCE: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    ROMANTASY:
      "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
    FANTASY:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    DARK_ROMANCE:
      "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    THRILLER: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    BOOK_LISTS:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    SEASONAL_READS:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    FICTION:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    HISTORICAL_FICTION:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    CONTEMPORARY:
      "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    HISTORICAL:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    SPORTS_ROMANCE:
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  };

  const categoryLabels: Record<string, string> = {
    ROMANCE: "Romance",
    ROMANTASY: "Romantasy",
    FANTASY: "Fantasy",
    DARK_ROMANCE: "Dark Romance",
    THRILLER: "Thriller",
    BOOK_LISTS: "Book lists",
    SEASONAL_READS: "Seasonal reads",
    FICTION: "Fiction",
    HISTORICAL_FICTION: "Historical-fiction",
    CONTEMPORARY: "Contemporary",
    HISTORICAL: "Historical",
    SPORTS_ROMANCE: "Sports-romance",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
          {post.featuredImage && (
            <div className="relative h-48 md:h-64 overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    categoryColors[post.category] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {categoryLabels[post.category] || post.category}
                </span>
              </div>
            </div>
          )}

          <CardHeader className="flex-1">
            <h3 className="font-cinzel text-xl md:text-2xl font-bold text-navy dark:text-cream group-hover:text-navy/80 dark:group-hover:text-cream/80 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </CardHeader>

          <CardContent className="space-y-3">
            {post.excerpt && (
              <p className="text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>MarkedByTrobes</span>
              </div>
              {post.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{readingTime(post.content)} min read</span>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <span className="text-navy dark:text-cream font-semibold group-hover:gap-2 transition-all inline-flex items-center gap-1">
              Read More
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
