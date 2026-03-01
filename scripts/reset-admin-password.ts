/**
 * Script to reset admin password
 * Usage: npx tsx scripts/reset-admin-password.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetAdminPassword() {
  const adminEmail = "markedbytrobes@gmail.com";
  const newPassword = "admin123"; // Change this to your desired password

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find or create admin user
    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        role: "ADMIN",
      },
      create: {
        email: adminEmail,
        name: "Admin",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin password reset successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", newPassword);
    console.log("\n⚠️  Make sure to change this password after logging in!");
  } catch (error) {
    console.error("❌ Error resetting admin password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
