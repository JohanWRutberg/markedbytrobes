import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    // Increment view count
    await prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track view:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 },
    );
  }
}
