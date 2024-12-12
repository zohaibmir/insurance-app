/**
 * src/lib/prisma.ts
 */
import { PrismaClient } from "@prisma/client";

// eslint-disable-next-line no-var
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Enable logging for debugging
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
