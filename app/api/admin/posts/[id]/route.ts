import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { createSlug } from "@/lib/text-utils";

const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  author: z.string(),
  image: z.string().optional(),
  amazonLink: z.string(),
  summary: z.string(),
  whoFor: z.string().optional(),
  emotionalPoints: z.array(z.string()),
});

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  content: z.string().min(1),
  category: z.enum([
    "ROMANCE",
    "ROMANTASY",
    "FANTASY",
    "DARK_ROMANCE",
    "THRILLER",
    "BOOK_LISTS",
    "SEASONAL_READS",
    "FICTION",
    "HISTORICAL_FICTION",
    "CONTEMPORARY",
    "HISTORICAL",
    "SPORTS_ROMANCE",
  ]),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  books: z.array(bookSchema).default([]),
});

// GET single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        tags: true,
        books: {
          orderBy: { order: "asc" },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}

// PUT update post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = postSchema.parse(body);

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Generate slug if changed
    const slug = data.slug || createSlug(data.title);

    // Check if slug is taken by another post
    if (slug !== existingPost.slug) {
      const slugTaken = await prisma.post.findFirst({
        where: {
          slug,
          id: { not: params.id },
        },
      });

      if (slugTaken) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 },
        );
      }
    }

    // Prepare tag operations
    const tagOperations = data.tags.map((tagName) => ({
      where: { name: tagName },
      create: {
        name: tagName,
        slug: createSlug(tagName),
      },
    }));

    // Delete existing books and create new ones
    await prisma.book.deleteMany({
      where: { postId: params.id },
    });

    // Update post
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        content: data.content,
        category: data.category,
        published: data.published,
        publishedAt:
          data.published && !existingPost.publishedAt
            ? new Date()
            : existingPost.publishedAt,
        tags: {
          set: [], // Disconnect all tags first
          connectOrCreate: tagOperations,
        },
        books: {
          create: data.books.map((book, index) => ({
            title: book.title,
            author: book.author,
            image: book.image,
            amazonLink: book.amazonLink,
            summary: book.summary,
            whoFor: book.whoFor,
            emotionalPoints: book.emotionalPoints,
            order: index,
          })),
        },
      },
      include: {
        tags: true,
        books: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

// DELETE post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete post (cascades to books, comments, ratings)
    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
