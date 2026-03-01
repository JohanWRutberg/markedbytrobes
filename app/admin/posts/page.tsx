import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { PostList } from "@/components/admin/post-list";

export const metadata = {
  title: "Manage Posts - Admin",
};

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
          ratings: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cinzel text-4xl font-bold text-navy dark:text-cream mb-2">
              Manage Posts
            </h1>
            <p className="text-muted-foreground">
              {posts.length} {posts.length === 1 ? "post" : "posts"} total
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/posts/new">
                <PlusCircle className="mr-2 w-4 h-4" />
                New Post
              </Link>
            </Button>
          </div>
        </div>

        <PostList posts={posts} />
      </div>
    </div>
  );
}
