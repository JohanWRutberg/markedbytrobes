import { PostForm } from "@/components/admin/post-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Create New Post - Admin",
};

export default function NewPostPage() {
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
            Create New Post
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to create a new blog post
          </p>
        </div>

        <PostForm />
      </div>
    </div>
  );
}
