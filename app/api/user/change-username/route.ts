import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Ej autentiserad" }, { status: 401 });
    }

    const { newUsername } = await req.json();

    if (!newUsername || !newUsername.trim()) {
      return NextResponse.json(
        { error: "Användarnamnet kan inte vara tomt" },
        { status: 400 },
      );
    }

    // Update user in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: newUsername.trim() },
    });

    return NextResponse.json({
      message: "Användarnamnet har ändrats",
    });
  } catch (error) {
    console.error("Username change error:", error);
    return NextResponse.json(
      { error: "Kunde inte ändra användarnamn" },
      { status: 500 },
    );
  }
}
