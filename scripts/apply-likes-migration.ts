import { PrismaClient } from "@prisma/client";

const PROD_DATABASE_URL =
  "postgresql://neondb_owner:npg_SpfH7zwtgbX4@ep-jolly-violet-agh5vtgp-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function applyMigration() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: PROD_DATABASE_URL,
      },
    },
  });

  try {
    console.log(
      "Applying migration: 20260301114650_add_likes_and_nested_comments\n",
    );

    // 1. Add parentId column to Comment table
    console.log("1. Adding parentId column to Comment table...");
    await prisma.$executeRaw`ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "parentId" TEXT`;
    console.log("   ✓ Done");

    // 2. Create Like table
    console.log("\n2. Creating Like table...");
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Like" (
        "id" TEXT NOT NULL,
        "postId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
      )
    `;
    console.log("   ✓ Done");

    // 3. Create indexes for Like table
    console.log("\n3. Creating indexes for Like table...");
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Like_postId_idx" ON "Like"("postId")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Like_userId_idx" ON "Like"("userId")`;
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Like_postId_userId_key" ON "Like"("postId", "userId")`;
    console.log("   ✓ Done");

    // 4. Create index for Comment.parentId
    console.log("\n4. Creating index for Comment.parentId...");
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Comment_parentId_idx" ON "Comment"("parentId")`;
    console.log("   ✓ Done");

    // 5. Add foreign key constraints
    console.log("\n5. Adding foreign key constraints...");

    // Check if constraint already exists
    const commentFkExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Comment_parentId_fkey'
        AND table_name = 'Comment'
      ) as exists
    `;

    if (!commentFkExists[0].exists) {
      await prisma.$executeRaw`
        ALTER TABLE "Comment" 
        ADD CONSTRAINT "Comment_parentId_fkey" 
        FOREIGN KEY ("parentId") REFERENCES "Comment"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE
      `;
      console.log("   ✓ Added Comment_parentId_fkey");
    } else {
      console.log("   - Comment_parentId_fkey already exists");
    }

    // Like -> Post FK
    const likePostFkExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Like_postId_fkey'
        AND table_name = 'Like'
      ) as exists
    `;

    if (!likePostFkExists[0].exists) {
      await prisma.$executeRaw`
        ALTER TABLE "Like" 
        ADD CONSTRAINT "Like_postId_fkey" 
        FOREIGN KEY ("postId") REFERENCES "Post"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE
      `;
      console.log("   ✓ Added Like_postId_fkey");
    } else {
      console.log("   - Like_postId_fkey already exists");
    }

    // Like -> User FK
    const likeUserFkExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'Like_userId_fkey'
        AND table_name = 'Like'
      ) as exists
    `;

    if (!likeUserFkExists[0].exists) {
      await prisma.$executeRaw`
        ALTER TABLE "Like" 
        ADD CONSTRAINT "Like_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE
      `;
      console.log("   ✓ Added Like_userId_fkey");
    } else {
      console.log("   - Like_userId_fkey already exists");
    }

    console.log("\n✅ Migration applied successfully!");
    console.log(
      "\nYou can now reload your blog in production - it should work!",
    );
  } catch (error) {
    console.error("\n❌ Error applying migration:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration();
