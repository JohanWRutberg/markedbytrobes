import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Nuvarande lösenord krävs"),
  newPassword: z.string().min(8, "Lösenordet måste vara minst 8 tecken"),
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
    const data = changePasswordSchema.parse(body);

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

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Nuvarande lösenord är felaktigt" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: "Lösenordet har ändrats",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Kunde inte ändra lösenord" },
      { status: 500 },
    );
  }
}
