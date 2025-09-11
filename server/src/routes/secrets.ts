import { Router } from "express";
import { Request, Response } from "express";
import prisma from "@/config/database";
import { log } from "@/utils";
import { authorized } from "@/middleware";

const router = Router();

export async function getAllSecrets(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    if (!req.account?.id) {
      return res.status(401).json({ error: "No account found for user" });
    }
    const secrets = await prisma.secret.findMany({
      where: { accountId: req.account.id },
    });
    res.status(200).json(secrets);
  } catch (error) {
    log.error("secrets retrieval failed");
    res.status(500).json({ error: "Failed to retrieve secrets" });
  }
}

async function deleteSecureShareHandler(
  req: Request<{ id: string }>,
  res: Response
): Promise<Response | void> {
  try {
    const { id } = req.params;
    const secret = await prisma.secret.findFirst({
      where: { id, accountId: req.account?.id },
    });
    if (!secret) {
      return res.status(404).json({ error: "Secret not found" });
    }
    await prisma.secret.delete({
      where: { id },
    });
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete secret" });
  }
}

async function revokeSecureShareHandler(
  req: Request<{ id: string }>,
  res: Response
): Promise<Response | void> {
  try {
    const { id } = req.params;
    const secret = await prisma.secret.findFirst({
      where: { id, accountId: req.account?.id },
    });
    if (!secret) {
      return res.status(404).json({ error: "Secret not found" });
    }
    await prisma.secret.update({
      where: { id },
      data: {
        encryptedData: "",
        passwordHash: null,
        iv: "",
        expiresAt: new Date(),
      },
    });
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to revoke secret" });
  }
}

// Routes
router.get("/", authorized, getAllSecrets);
router.delete("/:id", authorized, deleteSecureShareHandler);
router.post("/:id", authorized, revokeSecureShareHandler);

export default router;
