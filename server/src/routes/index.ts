import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/config/auth";
import secretsRouter from "./secrets";
import secureTextRouter from "./secure";
import apiRouter from "./api";

const router = Router();

// auth routes (better auth)
router.all("/auth/*", toNodeHandler(auth));

// api routes for dashboard secrets management
router.use("/secrets", secretsRouter);

// routes for secure text sharing (with optional attachments)
router.use("/secure", secureTextRouter);

// other api routes like health check, stats, feedback
router.use("/", apiRouter);

export default router;
