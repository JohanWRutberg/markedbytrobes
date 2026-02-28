import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Manage Users - Admin",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          posts: true,
          comments: true,
          ratings: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cinzel text-4xl font-bold text-navy dark:text-cream mb-2">
              Manage Users
            </h1>
            <p className="text-muted-foreground">
              {users.length} {users.length === 1 ? "user" : "users"} registered
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-navy dark:text-cream text-lg">
                        {user.name || "Anonymous"}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {user.email}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>
                        Joined{" "}
                        {new Date(user.createdAt).toLocaleDateString("sv-SE")}
                      </span>
                      <span>{user._count.posts} posts</span>
                      <span>{user._count.comments} comments</span>
                      <span>{user._count.ratings} ratings</span>
                    </div>
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
