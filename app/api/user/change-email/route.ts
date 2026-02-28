import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const changeEmailSchema = z.object({
  newEmail: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(1, "Lösenord krävs"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Du måste vara inloggad" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const data = changeEmailSchema.parse(body);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Användare inte hittad eller använder OAuth" },
        { status: 400 },
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Felaktigt lösenord" },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.newEmail },
    });

    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json(
        { error: "E-postadressen används redan" },
        { status: 400 },
      );
    }

    // Update email
    await prisma.user.update({
      where: { id: user.id },
      data: { email: data.newEmail },
    });

    return NextResponse.json({
      message: "E-postadressen har ändrats",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }
    console.error("Error changing email:", error);
    return NextResponse.json(
      { error: "Kunde inte ändra e-postadress" },
      { status: 500 },
    );
  }
}
