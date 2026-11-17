import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { getEnv } from "../src/lib/env";

const env = getEnv();
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const category = await db.category.upsert({
    where: { slug: "kaos" },
    update: { name: "Kaos" },
    create: { name: "Kaos", slug: "kaos" },
  });

  const product = await db.product.upsert({
    where: { slug: "kaos-anorra-basic" },
    update: {},
    create: {
      categoryId: category.id,
      name: "Kaos Anorra Basic",
      slug: "kaos-anorra-basic",
      description: "Kaos katun dasar untuk keseharian.",
      status: "ACTIVE",
      price: 129000,
      images: {
        create: [
          {
            url: "/images/kaos-anorra-basic.svg",
            alt: "Kaos Anorra Basic",
            position: 0,
          },
        ],
      },
      variants: {
        create: [
          { size: "S", color: "Hitam", sku: "ANR-BASIC-S-HITAM", stock: 12 },
          { size: "M", color: "Hitam", sku: "ANR-BASIC-M-HITAM", stock: 18 },
          { size: "L", color: "Hitam", sku: "ANR-BASIC-L-HITAM", stock: 9 },
        ],
      },
    },
  });

  console.log(`Seed selesai: ${category.name} / ${product.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
