import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

const ratingSchema = z.object({
  postId: z.string(),
  rating: z.number().min(1).max(5),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { postId, rating } = ratingSchema.parse(body);

    const existingRating = await prisma.rating.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.id,
        },
      },
    });

    let result;
    if (existingRating) {
      result = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating },
      });
    } else {
      result = await prisma.rating.create({
        data: {
          rating,
          postId,
          userId: user.id,
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 },
    );
  }
}
