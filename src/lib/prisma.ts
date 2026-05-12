import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { getPool } from "@/lib/db";

type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
  prismaSchemaGen?: number;
};

const globalWithPrisma = globalThis as GlobalWithPrisma;

/** Bump when `schema.prisma` gains fields/models so dev HMR does not keep a stale PrismaClient. */
const PRISMA_SCHEMA_GEN = 2;

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg(getPool());
  return new PrismaClient({ adapter });
}

/**
 * Reuse one client per process. After `prisma generate`, dev HMR can leave an old global singleton
 * whose User (etc.) delegates do not match the current schema — invalidate via {@link PRISMA_SCHEMA_GEN}.
 */
function resolvePrismaClient(): PrismaClient {
  const cached = globalWithPrisma.prisma;

  if (
    cached !== undefined &&
    "product" in cached &&
    globalWithPrisma.prismaSchemaGen === PRISMA_SCHEMA_GEN
  ) {
    return cached;
  }

  const client = createPrismaClient();
  globalWithPrisma.prisma = client;
  globalWithPrisma.prismaSchemaGen = PRISMA_SCHEMA_GEN;
  return client;
}

export const prisma: PrismaClient = resolvePrismaClient();
