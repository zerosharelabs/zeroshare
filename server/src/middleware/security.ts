import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import useragent from "express-useragent";
import hpp from "hpp";
import { NextFunction, Request, Response } from "express";
import { TimeUnit } from "@/utils";

const isDev = process.env.NODE_ENV === "development";

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://zeroshare.io",
        "https://*.zeroshare.io",
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      scriptSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://zeroshare.io",
        "https://*.zeroshare.io",
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'",
        "https://zeroshare.io",
        "https://*.zeroshare.io",
        "http://localhost:3000",
        "http://*.localhost:3000",
      ],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      sandbox: ["allow-forms", "allow-scripts", "allow-same-origin"],
    },
  },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
});

export const rateLimiter = rateLimit({
  windowMs: TimeUnit.MINUTE,
  limit: 60,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

export const customCors = cors({
  origin: isDev
    ? true
    : [
        "http://localhost:3000",
        "http://localhost:3030",
        "https://zeroshare.io",
      ],
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  credentials: true,
});

export const userAgent = useragent.express();
export const customHpp = hpp();

export const botProtection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.useragent && req.useragent.isBot) {
    const legitimateBots = ["Googlebot", "Bingbot", "YandexBot"];
    const isLegitimateBot = legitimateBots.some(
      (bot) => req.useragent && req.useragent.source.includes(bot)
    );
    if (!isLegitimateBot) {
      res.status(403).json({ error: "Bots are not allowed" });
      return;
    }
  }
  next();
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isDev = process.env.NODE_ENV === "development";
  res.status(500).json({
    error: "Internal server error",
    ...(isDev && { details: error.message, stack: error.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
};
