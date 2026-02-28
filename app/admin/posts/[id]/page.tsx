import { PostForm } from "@/components/admin/post-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Edit Post - Admin",
};

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      tags: true,
      books: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!post) {
    redirect("/admin/posts");
  }

  // Transform post data to match form structure
  const postData = {
    ...post,
    tags: post.tags.map((tag) => tag.name),
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" asChild>
              <Link href="/admin/posts">← Back to Posts</Link>
            </Button>
          </div>
          <h1 className="font-cinzel text-4xl font-bold text-navy dark:text-cream mb-2">
            Edit Post
          </h1>
          <p className="text-muted-foreground">
            Update the details below to edit your blog post
          </p>
        </div>

        <PostForm initialData={postData} isEditing />
      </div>
    </div>
  );
}
