import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { createSlug } from "@/lib/text-utils";

const bookSchema = z.object({
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

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await request.json();
    const data = postSchema.parse(body);

    // Generate slug if not provided
    const slug = data.slug || createSlug(data.title);

    // Check if slug exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 },
      );
    }

    // Create or connect tags
    const tagOperations = data.tags.map((tagName) => ({
      where: { name: tagName },
      create: {
        name: tagName,
        slug: createSlug(tagName),
      },
    }));

    // Create post with books and tags
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage,
        content: data.content,
        category: data.category,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
        authorId: user.id,
        tags: {
          connectOrCreate: tagOperations,
        },
        books: {
          create: data.books.map((book, index) => ({
            ...book,
            order: index,
          })),
        },
      },
      include: {
        tags: true,
        books: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
