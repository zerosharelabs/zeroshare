import { Request, Response, NextFunction } from "express";
import { MAX_FILE_SIZE_BYTES } from "@/config/server";

const VALID_EXPIRATION_TIMES = [
  { label: "10 Minutes", value: 600 },
  { label: "1 Hour", value: 3600 },
  { label: "24 Hours", value: 86400 },
  { label: "7 Days", value: 604800 },
  { label: "30 Days", value: 2592000 },
];

function isString(val: any): val is string {
  return typeof val === "string";
}

function isValidLinkId(linkId: any): boolean {
  return (
    isString(linkId) && /^[a-zA-Z0-9_-]+$/.test(linkId) && linkId.length <= 100
  );
}

export const validateCreateSecureShare = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { linkId, encryptedData, iv, expiresIn } = req.body;

  if (!isValidLinkId(linkId)) {
    res.status(400).json({
      error: "linkId is required, must be a string, and valid format",
    });
    return;
  }
  if (!isString(encryptedData)) {
    res
      .status(400)
      .json({ error: "encryptedData is required and must be a string" });
    return;
  }
  if (!isString(iv)) {
    res.status(400).json({ error: "iv is required and must be a string" });
    return;
  }

  if (Buffer.byteLength(encryptedData, "utf8") > 10 * 1024 * 1024) {
    res.status(413).json({ error: "Data size exceeds maximum limit" });
    return;
  }

  if (
    expiresIn !== undefined &&
    !VALID_EXPIRATION_TIMES.some((time) => time.value === expiresIn)
  ) {
    res.status(400).json({ error: "Invalid expiration time" });
    return;
  }

  next();
};

export const validateLinkId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { linkId } = req.params;
  if (!isValidLinkId(linkId)) {
    res.status(400).json({
      error: "linkId is required, must be a string, and valid format",
    });
    return;
  }
  next();
};

export const validatePassword = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { password } = req.body;
  if (password !== undefined) {
    if (!isString(password)) {
      res.status(400).json({ error: "password must be a string" });
      return;
    }
    if (password.length > 1000) {
      res.status(400).json({ error: "password is too long" });
      return;
    }
  }
  next();
};

export const validateAttachment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { attachment, encryptedData } = req.body;

  if (attachment === true) {
    const encryptedDataSize = Buffer.byteLength(encryptedData, "utf8");


    if (encryptedDataSize > MAX_FILE_SIZE_BYTES * 2) { // Allow some overhead for encryption
      res.status(413).json({
        error: `File size exceeds maximum limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`
      });
      return;
    }
  }

  next();
};
