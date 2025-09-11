import crypto from "crypto";
import path from "path";
import fs from "fs";
import * as openpgp from "openpgp";
import prisma from "./database";
import { log } from "@/utils";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_LENGTH = 32;
const ITERATION_COUNT = 100000;

interface EncryptionResult {
  encryptedData: string;
  iv: string;
  tag: string;
}

interface DecryptionResult {
  decryptedData: string;
}

// OpenPGP Key Management
const publicKeyPath = path.join(__dirname, "../../../public.asc");
const privateKeyPath = path.join(__dirname, "../../../private.asc");

export async function initializeOpenPGPKeys() {
  if (!fs.existsSync(publicKeyPath) || !fs.existsSync(privateKeyPath)) {
    const { privateKey, publicKey } = await openpgp.generateKey({
      type: "rsa",
      rsaBits: 2048,
      userIDs: [{ name: "ZeroShare", email: "admin@zeroshare.io" }],
    });
    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);
    log.success("successfully generated openpgp key pair.");
  }
}

export function getPublicKey(): string {
  if (!fs.existsSync(publicKeyPath)) {
    throw new Error("Public key not available yet");
  }
  return fs.readFileSync(publicKeyPath, "utf8");
}

// AES Encryption/Decryption
function deriveKey(masterKey: string, iv: Buffer): Buffer {
  return crypto.pbkdf2Sync(
    masterKey,
    iv,
    ITERATION_COUNT,
    KEY_LENGTH,
    "sha256"
  );
}

export function encrypt(data: string): EncryptionResult {
  const masterKey = process.env.ENCRYPTION_KEY;
  if (!masterKey)
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(masterKey, iv);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  const tag = cipher.getAuthTag();
  return {
    encryptedData,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

export function decrypt(
  encryptedData: string,
  iv: string,
  tag: string
): DecryptionResult {
  const masterKey = process.env.ENCRYPTION_KEY;
  if (!masterKey)
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  const ivBuffer = Buffer.from(iv, "hex");
  const key = deriveKey(masterKey, ivBuffer);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(Buffer.from(tag, "hex"));
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return { decryptedData };
}

export async function updateAccessAttempts(id: string) {
  await prisma.secret.update({
    where: { id },
    data: {
      lastAccessedAt: new Date(),
      accessAttempts: { increment: 1 },
    },
  });
}

export async function updatePasswordAttempts(id: string) {
  await prisma.secret.update({
    where: { id },
    data: {
      passwordAttempts: { increment: 1 },
    },
  });
}
