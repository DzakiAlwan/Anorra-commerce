import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getEnv } from "@/lib/env";

type GlobalWithPrisma = typeof globalThis & {
  anorraPrisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalWithPrisma;

export function getDb(): PrismaClient {
  if (!globalForPrisma.anorraPrisma) {
    const env = getEnv();
    const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
    globalForPrisma.anorraPrisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.anorraPrisma;
}
