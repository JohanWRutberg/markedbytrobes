/**
 * Deploy database migrations to production
 *
 * This script runs pending Prisma migrations against the production database.
 *
 * Usage:
 *   1. Set the PROD_DATABASE_URL environment variable to your Neon production database URL
 *   2. Run: DATABASE_URL=$PROD_DATABASE_URL npx prisma migrate deploy
 *
 * Or on Windows PowerShell:
 *   $env:DATABASE_URL="your-prod-url"; npx prisma migrate deploy
 */

console.log("To deploy migrations to production:");
console.log("");
console.log(
  "1. Get your production database URL from Vercel environment variables",
);
console.log("2. Run one of these commands:");
console.log("");
console.log("   On Mac/Linux:");
console.log('   DATABASE_URL="your-prod-url" npx prisma migrate deploy');
console.log("");
console.log("   On Windows PowerShell:");
console.log('   $env:DATABASE_URL="your-prod-url"; npx prisma migrate deploy');
console.log("");
console.log("The migrations to be applied:");
console.log("  - 20260301111232_update_categories (updates Category enum)");
console.log("  - 20260301114650_add_likes_and_nested_comments");
