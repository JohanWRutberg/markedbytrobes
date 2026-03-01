"use client";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none mb-12 blog-content"
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning
    />
  );
}
