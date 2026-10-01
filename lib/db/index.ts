import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not defined. Add it to your environment variables.",
  );
}

const adapter = new PrismaPg({
  connectionString,
});

export const db = new PrismaClient({
  adapter,
});
