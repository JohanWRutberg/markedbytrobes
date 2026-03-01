"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/text-utils";
import { User, Trash2, MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  parentId?: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export function CommentSection({
  postId,
  comments: initialComments,
}: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    commentId: string;
    commentUser: string;
  }>({ open: false, commentId: "", commentUser: "" });
  const [errorAlert, setErrorAlert] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  // Organize comments into parent and reply structure
  const organizeComments = (
    allComments: Comment[],
  ): (Comment & { replies: Comment[] })[] => {
    const commentMap = new Map<string, Comment & { replies: Comment[] }>();
    const rootComments: (Comment & { replies: Comment[] })[] = [];

    // First pass: create map with empty replies arrays
    allComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into parent-child structure
    allComments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const organizedComments = organizeComments(comments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent.trim() || !session) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: replyContent,
          parentId,
        }),
      });

      if (response.ok) {
        const reply = await response.json();
        setComments([...comments, reply]);
        setReplyContent("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (commentId: string, commentUser: string) => {
    setConfirmDelete({ open: true, commentId, commentUser });
  };

  const handleDeleteConfirm = async () => {
    const { commentId } = confirmDelete;
    setDeletingId(commentId);

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setErrorAlert({
        open: true,
        message: "Failed to delete comment. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={isReply ? "ml-12" : ""}>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-navy/10 dark:bg-cream/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-navy dark:text-cream">
                    {comment.user.name || "Anonymous"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2">{comment.content}</p>
                {session && !isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(comment.id)}
                    className="h-8 px-2 text-xs"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
            </div>
            {session &&
              (session.user.id === comment.user.id ||
                session.user.role === "ADMIN") && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleDeleteClick(
                      comment.id,
                      comment.user.name || "Anonymous",
                    )
                  }
                  className="text-red-600 hover:text-red-700"
                  disabled={deletingId === comment.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
          </div>

          {replyingTo === comment.id && (
            <div className="mt-4 ml-13 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.user.name || "Anonymous"}...`}
                className="min-h-[80px]"
                disabled={isSubmitting}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="font-cinzel text-2xl font-bold text-navy dark:text-cream">
        Comments ({comments.length})
      </h2>

      {session ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[100px]"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Sign in to join the conversation
            </p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {organizedComments.map((comment) => renderComment(comment))}
      </div>

      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={(open) => setConfirmDelete({ ...confirmDelete, open })}
        title="Delete Comment"
        description={`Are you sure you want to delete ${confirmDelete.commentUser}'s comment? This action cannot be undone.`}
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
    </div>
  );
}
