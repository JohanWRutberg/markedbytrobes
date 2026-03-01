import Link from "next/link";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";

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

        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-cinzel text-xl font-semibold text-navy dark:text-cream">
                        {post.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.published
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>By MarkedByTrobes</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("sv-SE")}
                      </span>
                      <span>{post.views} views</span>
                      <span>{post._count.comments} comments</span>
                      <span>{post._count.ratings} ratings</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.published && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/posts/${post.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
