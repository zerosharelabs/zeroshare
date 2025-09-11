import * as argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
  const secret = process.env.ARGON2_SECRET;
  if (!secret) throw new Error("ARGON2_SECRET environment variable is not set");
  const secretBuffer = Buffer.from(secret, "hex");
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
    secret: secretBuffer,
  });
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  const secret = process.env.ARGON2_SECRET;
  if (!secret) throw new Error("ARGON2_SECRET environment variable is not set");
  const secretBuffer = Buffer.from(secret, "hex");
  return await argon2.verify(hash, password, { secret: secretBuffer });
}
