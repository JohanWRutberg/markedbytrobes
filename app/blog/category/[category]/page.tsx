import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PostCard } from "@/components/blog/post-card";
import { Pagination } from "@/components/blog/pagination";
import { POSTS_PER_PAGE, CATEGORIES } from "@/lib/constants";

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categoryUpper = params.category.toUpperCase();
  const category = CATEGORIES.find((c) => c.value === categoryUpper);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.label} Books - Marked by Trobes`,
    description: `Discover the best ${category.label.toLowerCase()} books with our reviews and recommendations`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const categoryUpper = params.category.toUpperCase();
  const category = CATEGORIES.find((c) => c.value === categoryUpper);

  if (!category) {
    notFound();
  }

  const currentPage = Number(searchParams.page) || 1;
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
        category: categoryUpper as any,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: POSTS_PER_PAGE,
      skip,
    }),
    prisma.post.count({
      where: {
        published: true,
        category: categoryUpper as any,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-navy dark:text-cream mb-4">
            {category.label}
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover the best {category.label.toLowerCase()} books
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No posts in this category yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/blog/category/${params.category}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
