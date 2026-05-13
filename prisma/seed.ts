import { config } from "dotenv";

import { hashPassword } from "../src/lib/password";

config({ path: ".env.local" });
config();

const adminEmail = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_SEED_PASSWORD;
const adminName = process.env.ADMIN_SEED_NAME?.trim() || "Admin";

async function main(): Promise<void> {
  const { prisma } = await import("../src/lib/prisma");

  try {
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
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
