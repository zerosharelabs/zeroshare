import { Router } from "express";
import { Request, Response } from "express";
import { filesize } from "filesize";
import humanNumber from "human-number";
import prisma from "@/config/database";
import { getPublicKey } from "@/config/encryption";
import { sendFeedbackRequest } from "@/utils";

const router = Router();

export async function healthCheck(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "unknown",
      version: process.env.npm_package_version || "unknown",
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "unknown",
      version: process.env.npm_package_version || "unknown",
      database: "disconnected",
      error: "Database connection failed",
    });
  }
}

export async function getStatistics(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const stats = await prisma.statistic.findMany();

    const humanReadableStats = stats.map((stat) => {
      const value =
        stat.name === "bytes_destroyed"
          ? filesize(stat.value, { round: 0 })
          : humanNumber(stat.value);
      return {
        ...stat,
        value,
      };
    });

    res.status(200).json(humanReadableStats);
  } catch (error) {
    console.error("Stats retrieval failed:", error);
    res.status(500).json({ error: "Failed to retrieve stats" });
  }
}

export async function getPublicKeyHandler(req: Request, res: Response) {
  try {
    const publicKey = getPublicKey();
    res.type("text/plain").send(publicKey);
  } catch {
    res.status(503).json({ error: "Public key not available yet" });
  }
}

// Routes
router.get("/health", healthCheck);
router.get("/statistics", getStatistics);
router.get("/public-key", getPublicKeyHandler);
router.post("/feedback", sendFeedbackRequest);

export default router;
