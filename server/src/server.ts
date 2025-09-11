import dotenv from "dotenv";
import path from "path";
import express from "express";
import * as cron from "node-cron";
import cluster from "node:cluster";
import * as os from "node:os";
import { initializeOpenPGPKeys } from "@/config/encryption";
import {
  botProtection,
  customCors,
  customHpp,
  rateLimiter,
  securityHeaders,
  userAgent,
  errorHandler,
  notFoundHandler,
} from "@/middleware";
import apiRoutes from "@/routes";
import { deleteExpiredShares } from "@/utils/cleanup";
import { log } from "@/utils/logger";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const numCPUs = os.cpus().length;
const PORT = 3030;
export const isDev = process.env.NODE_ENV === "development";

log.info("running server in", isDev ? "development" : "production", "mode...");

initializeOpenPGPKeys();

if (cluster.isPrimary) {
  if (!isDev) {
    for (let i = 0; i < numCPUs; i++) cluster.fork();
  }
  cluster.on("exit", () => cluster.fork());
  cron.schedule("* * * * *", async () => await deleteExpiredShares());
}

if (cluster.isWorker || isDev) {
  const app = express();

  // Apply middleware
  app.use(userAgent);
  app.use(securityHeaders);
  app.use(customCors);
  app.use(customHpp);
  app.use(botProtection);
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use("/api", rateLimiter);
  app.use(express.json({ limit: "10mb" }));

  // Apply routes
  app.use("/api", apiRoutes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  const shutdownGracefully = () => {
    process.exit(0);
  };

  process.on("SIGTERM", shutdownGracefully);
  process.on("SIGINT", shutdownGracefully);

  app
    .listen(PORT, () => {})
    .on("error", (error: any) => {
      if (error.code === "EADDRINUSE") process.exit(1);
    });

  process.on("uncaughtException", shutdownGracefully);
  process.on("unhandledRejection", () => {});
}
