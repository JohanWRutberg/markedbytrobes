import { PrismaClient } from "@prisma/client";

const PROD_DATABASE_URL = process.env.PROD_DATABASE_URL;

if (!PROD_DATABASE_URL) {
  console.error("Error: PROD_DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function checkProdDatabase() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: PROD_DATABASE_URL,
      },
    },
  });

  try {
    console.log("Checking production database structure...\n");

    // Check tables
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    console.log("Tables in production:");
    tables.forEach((t) => console.log(`  - ${t.tablename}`));

    // Check enums
    console.log("\nEnums in production:");
    const enums = await prisma.$queryRaw<Array<{ typname: string }>>`
      SELECT typname 
      FROM pg_type 
      WHERE typtype = 'e'
      ORDER BY typname
    `;

    enums.forEach((e) => console.log(`  - ${e.typname}`));

    // Check migrations
    console.log("\nApplied migrations:");
    try {
      const migrations = await prisma.$queryRaw<
        Array<{ migration_name: string; finished_at: Date }>
      >`
        SELECT migration_name, finished_at 
        FROM _prisma_migrations 
        ORDER BY finished_at
      `;

      migrations.forEach((m) =>
        console.log(`  - ${m.migration_name} (${m.finished_at})`),
      );
    } catch (error) {
      console.log("  (No _prisma_migrations table found)");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProdDatabase();
