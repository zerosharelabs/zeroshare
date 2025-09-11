import { Buffer } from "buffer";

export class SecureShare {
  static generateRandomSecurePassword() {
    const charset =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const password = [];
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    for (let i = 0; i < 24; i++) {
      password.push(charset[randomBytes[i] % charset.length]);
    }
    return password.join("");
  }

  static generateShareLink() {
    const charset =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let linkId = "";
    let secretKey = "";

    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    for (let i = 0; i < 16; i++) {
      linkId += charset[randomBytes[i] % charset.length];
      secretKey += charset[randomBytes[i + 16] % charset.length];
    }

    return { linkId, secretKey };
  }

  static async deriveKey(secretKey: string, linkId: string) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secretKey + linkId),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode(linkId),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  static async encrypt(data: unknown, secretKey: string, linkId: string) {
    const key = await this.deriveKey(secretKey, linkId);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();

    const encrypted = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encoder.encode(JSON.stringify(data))
    );

    return {
      encrypted: this.bufferToBase64(encrypted),
      iv: this.bufferToBase64(iv.buffer),
    };
  }

  static async decrypt(
    encryptedData: string,
    iv: string,
    secretKey: string,
    linkId: string
  ) {
    const key = await this.deriveKey(secretKey, linkId);
    const decoder = new TextDecoder();

    try {
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: this.base64ToBuffer(iv),
        },
        key,
        this.base64ToBuffer(encryptedData)
      );

      return JSON.parse(decoder.decode(decrypted));
    } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error("Decryption failed");
    }
  }

  static bufferToBase64(buffer: ArrayBuffer) {
    return Buffer.from(buffer)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  static base64ToBuffer(base64: string) {
    base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return Buffer.from(base64, "base64");
  }

  static formatAsUUID(str: string): string {
    if (str.length !== 32) {
      throw new Error("Input string must be exactly 32 characters");
    }

    const segments = [
      str.slice(0, 8), // 8 chars
      str.slice(8, 12), // 4 chars
      str.slice(12, 16), // 4 chars
      str.slice(16, 20), // 4 chars
      str.slice(20, 32), // 12 chars
    ];

    return segments.join("-");
  }

  static revertUUID(uuid: string): string {
    // Remove all hyphens
    const stripped = uuid.replace(/-/g, "");

    if (stripped.length !== 32) {
      throw new Error(
        "Invalid UUID format - should contain 32 characters excluding hyphens"
      );
    }

    return stripped;
  }
}
