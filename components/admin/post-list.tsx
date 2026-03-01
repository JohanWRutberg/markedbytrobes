"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  views: number;
  _count: {
    comments: number;
    ratings: number;
  };
}

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts: initialPosts }: PostListProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    postId: string;
    postTitle: string;
  }>({ open: false, postId: "", postTitle: "" });
  const [errorAlert, setErrorAlert] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  const handleDeleteClick = (postId: string, postTitle: string) => {
    setConfirmDelete({ open: true, postId, postTitle });
  };

  const handleDeleteConfirm = async () => {
    const { postId } = confirmDelete;
    setDeletingId(postId);

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Remove post from local state
      setPosts(posts.filter((p) => p.id !== postId));
      router.refresh();
    } catch (error) {
      console.error("Error deleting post:", error);
      setErrorAlert({
        open: true,
        message: "Failed to delete post. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
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
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(post.id, post.title)}
                    disabled={deletingId === post.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={(open) => setConfirmDelete({ ...confirmDelete, open })}
        title="Delete Post"
        description={`Are you sure you want to delete "${confirmDelete.postTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        loading={deletingId !== null}
      />

      <AlertDialog
        open={errorAlert.open}
        onOpenChange={(open) => setErrorAlert({ ...errorAlert, open })}
        title="Error"
        description={errorAlert.message}
        type="error"
      />
    </>
  );
}
