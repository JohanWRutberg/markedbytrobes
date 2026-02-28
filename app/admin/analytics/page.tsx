import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Analytics - Admin",
};

export default async function AdminAnalyticsPage() {
  const [totalViews, avgRating, postsData, topPosts, recentComments] =
    await Promise.all([
      prisma.post.aggregate({
        _sum: {
          views: true,
        },
      }),
      prisma.rating.aggregate({
        _avg: {
          rating: true,
        },
      }),
      prisma.post.findMany({
        select: {
          category: true,
          published: true,
        },
      }),
      prisma.post.findMany({
        where: { published: true },
        take: 10,
        orderBy: { views: "desc" },
        select: {
          title: true,
          views: true,
          slug: true,
          _count: {
            select: {
              comments: true,
              ratings: true,
            },
          },
        },
      }),
      prisma.comment.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          post: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      }),
    ]);

  const publishedPosts = postsData.filter((p) => p.published).length;
  const draftPosts = postsData.filter((p) => !p.published).length;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cinzel text-4xl font-bold text-navy dark:text-cream mb-2">
              Analytics
            </h1>
            <p className="text-muted-foreground">
              Overview of your blog&apos;s performance
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalViews._sum.views || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgRating._avg.rating?.toFixed(1) || "N/A"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPosts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftPosts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Posts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Posts by Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div
                  key={post.slug}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-2xl text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-semibold text-navy dark:text-cream hover:underline"
                      >
                        {post.title}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">
                        {post._count.comments} comments • {post._count.ratings}{" "}
                        ratings
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{post.views}</div>
                    <div className="text-xs text-muted-foreground">views</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComments.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-semibold text-navy dark:text-cream">
                        {comment.user.name}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        on{" "}
                        <Link
                          href={`/blog/${comment.post.slug}`}
                          className="hover:underline"
                        >
                          {comment.post.title}
                        </Link>
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString("sv-SE")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
