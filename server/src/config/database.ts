import { PrismaClient } from "@prisma/client";
import { log } from "@/utils";

const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

async function connectToDatabase() {
  try {
    await prisma.$connect();
    log.success("database connected successfully");
  } catch {
    log.error("failed to connect to database");
    process.exit(1);
  }
}

async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect();
    log.info("database disconnected successfully");
  } catch {
    log.error("failed to disconnect from database");
  }
}

connectToDatabase();
process.on("beforeExit", disconnectFromDatabase);

export default prisma;
