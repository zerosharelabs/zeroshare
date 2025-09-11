import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/config/auth";
import secretsRouter from "./secrets";
import secureRouter from "./secure";
import apiRouter from "./api";

const router = Router();

// Auth routes (handles /api/auth/*)
router.all("/auth/*", toNodeHandler(auth));

// API routes
router.use("/secrets", secretsRouter);
router.use("/secure", secureRouter);
router.use("/", apiRouter);

export default router;
