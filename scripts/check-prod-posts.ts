import { PrismaClient } from "@prisma/client";

const PROD_DATABASE_URL = process.env.PROD_DATABASE_URL;

if (!PROD_DATABASE_URL) {
  console.error("Error: PROD_DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function checkPosts() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: PROD_DATABASE_URL,
      },
    },
  });

  try {
    console.log("Checking posts in production...\n");

    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        published: true,
      },
    });

    console.log(`Total posts: ${posts.length}\n`);

    // Group by category
    const byCategory = posts.reduce(
      (acc, post) => {
        if (!acc[post.category]) {
          acc[post.category] = [];
        }
        acc[post.category].push(post);
        return acc;
      },
      {} as Record<string, typeof posts>,
    );

    console.log("Posts by category:");
    Object.entries(byCategory)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([category, categoryPosts]) => {
        console.log(`\n${category}: ${categoryPosts.length} posts`);
        categoryPosts.forEach((post) => {
          console.log(
            `  - ${post.title} (${post.slug}) ${post.published ? "✓" : "✗"}`,
          );
        });
      });

    // Check for invalid categories
    const validCategories = [
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

    const invalidPosts = posts.filter(
      (p) => !validCategories.includes(p.category),
    );

    if (invalidPosts.length > 0) {
      console.log("\n⚠️  Posts with invalid categories:");
      invalidPosts.forEach((post) => {
        console.log(`  - ${post.title}: ${post.category}`);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();
