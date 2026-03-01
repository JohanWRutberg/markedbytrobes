import { PrismaClient } from "@prisma/client";

const PROD_DATABASE_URL = process.env.PROD_DATABASE_URL;

if (!PROD_DATABASE_URL) {
  console.error("Error: PROD_DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function updateCategoryEnum() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: PROD_DATABASE_URL,
      },
    },
  });

  try {
    console.log("Checking Category enum values in production...");

    // Query the enum values
    const result = await prisma.$queryRaw<Array<{ enumlabel: string }>>`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Category')
      ORDER BY enumlabel
    `;

    console.log("\nCurrent Category values in production:");
    result.forEach((r) => console.log(`  - ${r.enumlabel}`));

    const currentValues = result.map((r) => r.enumlabel);
    const requiredValues = [
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
    ];

    const missingValues = requiredValues.filter(
      (v) => !currentValues.includes(v),
    );

    if (missingValues.length === 0) {
      console.log("\n✅ All required category values exist!");
      return;
    }

    console.log("\n⚠️  Missing category values:");
    missingValues.forEach((v) => console.log(`  - ${v}`));

    console.log("\nAdding missing values...");

    for (const value of missingValues) {
      try {
        await prisma.$executeRawUnsafe(
          `ALTER TYPE "Category" ADD VALUE IF NOT EXISTS '${value}'`,
        );
        console.log(`  ✓ Added ${value}`);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("already exists")
        ) {
          console.log(`  - ${value} already exists`);
        } else {
          console.error(`  ✗ Failed to add ${value}:`, error);
        }
      }
    }

    console.log("\n✅ Category enum updated successfully!");
  } catch (error) {
    console.error("Error updating category enum:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateCategoryEnum();
