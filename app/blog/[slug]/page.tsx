import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, User, Clock, Tag } from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { BookCard } from "@/components/post/book-card";
import { RatingWidget } from "@/components/post/rating-widget";
import { CommentSection } from "@/components/post/comment-section";
import { ViewTracker } from "@/components/post/view-tracker";
import { BlogContent } from "@/components/post/blog-content";
import { formatDate, readingTime } from "@/lib/text-utils";
import { AFFILIATE_DISCLOSURE_SHORT } from "@/lib/affiliate";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} - Marked by Trobes`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      tags: true,
      books: {
        orderBy: {
          order: "asc",
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      ratings: session?.user?.id
        ? {
            where: {
              userId: session.user.id,
            },
            take: 1,
          }
        : false,
    },
  });

  if (!post || (!post.published && session?.user.role !== "ADMIN")) {
    notFound();
  }

  // Calculate average rating
  const allRatings = await prisma.rating.findMany({
    where: { postId: post.id },
  });
  const averageRating =
    allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
      : 0;

  const categoryLabels: Record<string, string> = {
    ROMANCE: "Romance",
    SELF_DEVELOPMENT: "Self Development",
    THRILLER: "Thriller",
    BOOK_LISTS: "Book Lists",
    SEASONAL_READS: "Seasonal Reads",
  };

  return (
    <article className="py-12" suppressHydrationWarning>
      {/* Track view on client side */}
      <ViewTracker postId={post.id} />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              {
                label: categoryLabels[post.category],
                href: `/blog/category/${post.category.toLowerCase()}`,
              },
              { label: post.title },
            ]}
          />

          {/* Affiliate Disclosure */}
          <div className="mb-8 p-4 bg-cream/30 dark:bg-navy/30 rounded-lg text-sm text-center">
            <p className="text-muted-foreground">
              {AFFILIATE_DISCLOSURE_SHORT}
            </p>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative w-full h-[400px] md:h-[500px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-navy/10 dark:bg-cream/20 text-navy dark:text-cream rounded-full text-sm font-semibold">
                {categoryLabels[post.category]}
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-cream/80 dark:bg-cream/20 text-navy dark:text-cream rounded-full text-sm"
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {tag.name}
                </span>
              ))}
            </div>

            <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-navy dark:text-cream mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>MarkedByTrobes</span>
              </div>
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime(post.content)} min read</span>
              </div>
              <div>
                <span>{post.views} views</span>
              </div>
            </div>
          </header>

          {/* Post Content */}
          <BlogContent content={post.content} />

          {/* Book Cards */}
          {post.books.length > 0 && (
            <div className="space-y-6 mb-12">
              <h2 className="font-cinzel text-3xl font-bold text-navy dark:text-cream">
                Featured Books
              </h2>
              {post.books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {/* Rating Widget */}
          <div className="mb-12 p-6 border rounded-lg">
            <h2 className="font-cinzel text-2xl font-bold text-navy dark:text-cream mb-6 text-center">
              Rate This Post
            </h2>
            <RatingWidget
              postId={post.id}
              initialRating={
                Array.isArray(post.ratings) && post.ratings.length > 0
                  ? post.ratings[0].rating
                  : undefined
              }
              averageRating={averageRating}
              totalRatings={allRatings.length}
            />
          </div>

          {/* Comments Section */}
          <div className="border-t pt-12">
            <CommentSection postId={post.id} comments={post.comments} />
          </div>
        </div>
      </div>
    </article>
  );
}
