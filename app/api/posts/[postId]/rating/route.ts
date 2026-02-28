import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
});

// GET - Get average rating and count for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    const ratings = await prisma.rating.findMany({
      where: { postId: params.postId },
    });

    const count = ratings.length;
    const average =
      count > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    return NextResponse.json({
      average: Math.round(average * 10) / 10, // Round to 1 decimal
      count,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 },
    );
  }
}

// POST - Create or update a rating
export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const data = ratingSchema.parse(body);

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Upsert rating (create or update)
    const rating = await prisma.rating.upsert({
      where: {
        postId_userId: {
          postId: params.postId,
          userId: user.id,
        },
      },
      create: {
        rating: data.rating,
        postId: params.postId,
        userId: user.id,
      },
      update: {
        rating: data.rating,
      },
    });

    // Get updated average
    const ratings = await prisma.rating.findMany({
      where: { postId: params.postId },
    });

    const count = ratings.length;
    const average =
      count > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    return NextResponse.json({
      rating,
      average: Math.round(average * 10) / 10,
      count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid rating value" },
        { status: 400 },
      );
    }
    console.error("Error saving rating:", error);
    return NextResponse.json(
      { error: "Failed to save rating" },
      { status: 500 },
    );
  }
}
