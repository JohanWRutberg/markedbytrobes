import { PrismaClient } from "@prisma/client";

const PROD_DATABASE_URL =
  "postgresql://neondb_owner:npg_SpfH7zwtgbX4@ep-jolly-violet-agh5vtgp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function checkCommentSchema() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: PROD_DATABASE_URL,
      },
    },
  });

  try {
    console.log("Checking Comment table schema in production...\n");

    const columns = await prisma.$queryRaw<
      Array<{ column_name: string; data_type: string; is_nullable: string }>
    >`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'Comment'
      ORDER BY ordinal_position
    `;

    console.log("Columns in Comment table:");
    columns.forEach((col) => {
      console.log(
        `  - ${col.column_name}: ${col.data_type} ${col.is_nullable === "YES" ? "(nullable)" : "(required)"}`,
      );
    });

    const hasParentId = columns.some((col) => col.column_name === "parentId");
    const hasLikeTable = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Like'
      ) as exists
    `;

    console.log("\n Status:");
    console.log(`  parentId column: ${hasParentId ? "✓ EXISTS" : "✗ MISSING"}`);
    console.log(
      `  Like table: ${hasLikeTable[0].exists ? "✓ EXISTS" : "✗ MISSING"}`,
    );

    if (!hasParentId) {
      console.log(
        "\n⚠️  Migration 20260301114650_add_likes_and_nested_comments not fully applied!",
      );
      console.log(
        "This will cause errors when trying to load blog posts with comments.",
      );
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCommentSchema();
