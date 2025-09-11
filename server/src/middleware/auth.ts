import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "@/config/auth";
import { Account, User } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
    account?: Account;
  }
}

export const authorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = session.user;
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.user = {
    ...user,
    isAnonymous: user.isAnonymous ?? null,
    image: user.image ?? null,
  };
  try {
    const prisma = (await import("@/config/database")).default;
    const account = await prisma.account.findFirst({
      where: { userId: user.id },
    });
    req.account = account ?? undefined;
  } catch {
    req.account = undefined;
  }
  next();
};

export const requireAuth = toNodeHandler(auth);
