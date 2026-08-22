import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateApiKey, hashApiKey } from "../src/lib/api-key";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME ?? "Kaswebtech Admin";

  if (!adminEmail || !adminPassword) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env before seeding");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {},
    create: { email: adminEmail.toLowerCase(), passwordHash, name: adminName },
  });
  console.log(`Admin user ready: ${admin.email}`);

  const existingWishKeeper = await prisma.application.findUnique({
    where: { appId: "wishkeeper" },
  });

  if (existingWishKeeper) {
    console.log("WishKeeper application already exists, skipping.");
    return;
  }

  const { plaintextKey, prefix } = generateApiKey();
  const apiKeyHash = await hashApiKey(plaintextKey);

  await prisma.application.create({
    data: {
      appId: "wishkeeper",
      name: "WishKeeper",
      logoUrl: "https://placehold.co/128x128/6366f1/ffffff.png?text=WK",
      brandColor: "#6366f1",
      apiKeyPrefix: prefix,
      apiKeyHash,
    },
  });

  console.log("\nWishKeeper application created.");
  console.log("API key (store this securely, it will not be shown again):");
  console.log(plaintextKey);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
