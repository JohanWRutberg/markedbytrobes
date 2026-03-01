import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Du måste vara inloggad" },
        { status: 401 },
      );
    }

    // Get user with accounts
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Användare hittades inte" },
        { status: 404 },
      );
    }

    // Check if user has OAuth account
    const hasOAuthAccount = user.accounts.some(
      (account) => account.provider === "google",
    );

    // Check if user has password (credentials account)
    const hasPassword = !!user.password;

    return NextResponse.json({
      hasOAuthAccount,
      hasPassword,
      isOAuthOnly: hasOAuthAccount && !hasPassword,
    });
  } catch (error) {
    console.error("Error checking auth method:", error);
    return NextResponse.json({ error: "Ett fel uppstod" }, { status: 500 });
  }
}
