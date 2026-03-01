/**
 * Check Vercel deployment status
 *
 * Instructions:
 * 1. Go to https://vercel.com/johans-projects/markedbytrobes/deployments
 * 2. Click on the latest deployment
 * 3. Check the "Building" tab for errors
 * 4. Look for:
 *    - ✓ prisma generate (should show Category enum with 12 values)
 *    - ✓ prisma migrate deploy
 *    - ✓ next build
 *
 * If build succeeded but error persists, check Runtime Logs for the actual error.
 */

console.log("To debug production error:");
console.log(
  "1. Check build logs: https://vercel.com/johans-projects/markedbytrobes/deployments",
);
console.log("2. Check runtime logs for digest 3069134224");
console.log("3. Look for Prisma Client generation output");
