// Script för att hasha lösenord
// Användning: node scripts/hash-password.js ditt-lösenord

const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("❌ Fel: Du måste ange ett lösenord");
  console.log("\nAnvändning: node scripts/hash-password.js ditt-lösenord");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log("\n✅ Hashat lösenord:");
console.log(hash);
console.log(
  "\n📋 Kopiera hashen ovan och klistra in den i 'password'-fältet i Prisma Studio",
);
