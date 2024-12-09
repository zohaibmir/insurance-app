import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development mode
declare global {
  // Allow global `prisma` variable in TypeScript
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: ['query'], // Enable query logging in development
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
