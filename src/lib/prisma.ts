import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

import { getDatabaseConfig } from "@/lib/db";

type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
  prismaSchemaGen?: number;
};

const globalWithPrisma = globalThis as GlobalWithPrisma;

/** Bump when `schema.prisma` gains fields/models so dev HMR does not keep a stale PrismaClient. */
const PRISMA_SCHEMA_GEN = 2;

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaMariaDb(getDatabaseConfig());
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

const createLazyPrismaClient = (): PrismaClient =>
  new Proxy({} as PrismaClient, {
    get: (_target, property, receiver) => {
      const client = resolvePrismaClient();
      const value = Reflect.get(client, property, receiver);

      return typeof value === "function" ? value.bind(client) : value;
    },
    has: (_target, property) => property in resolvePrismaClient(),
  });

export const prisma: PrismaClient = createLazyPrismaClient();
