import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

const globalPrismaClient = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalPrismaClient.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalPrismaClient.prisma = db;
}
