import "dotenv/config";

import { hashPassword } from "../src/lib/password";
import { prisma } from "../src/lib/prisma";

const adminEmail = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_SEED_PASSWORD;
const adminName = process.env.ADMIN_SEED_NAME?.trim() || "Admin";

async function main(): Promise<void> {
  if (!adminEmail || !adminPassword) {
    console.info("Skipping admin seed: set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env");
    return;
  }

  const passwordHash = await hashPassword(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      emailVerified: new Date(),
      name: adminName,
      passwordHash,
      role: "ADMIN",
    },
    update: {
      emailVerified: new Date(),
      name: adminName,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.info(`Admin user ready: ${adminEmail}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
