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

  static async encrypt(
    textData: unknown,
    file: File | null,
    secretKey: string,
    linkId: string
  ) {
    const key = await this.deriveKey(secretKey, linkId);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    let fileData = null;
    if (file) {
      // Read file as ArrayBuffer and convert to array
      const fileBuffer = await file.arrayBuffer();
      fileData = {
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          lastModified: file.lastModified,
        },
        data: Array.from(new Uint8Array(fileBuffer)),
      };
    }

    // Combine text and file data
    const combinedData = {
      text: textData,
      attachment: fileData,
    };

    // Encrypt the combined data
    const encoder = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encoder.encode(JSON.stringify(combinedData))
    );

    return {
      encrypted: this.bufferToBase64(encrypted),
      iv: this.bufferToBase64(iv.buffer),
      attachment: !!file,
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

      const combinedData = JSON.parse(decoder.decode(decrypted));

     if (combinedData.text !== undefined || combinedData.attachment !== undefined) {
        let attachmentFile = null;
        if (combinedData.attachment) {
          const { metadata, data } = combinedData.attachment;
          const fileBuffer = new Uint8Array(data);
          const blob = new Blob([fileBuffer], { type: metadata.mimeType });
          attachmentFile = new File([blob], metadata.fileName, {
            type: metadata.mimeType,
            lastModified: metadata.lastModified || Date.now(),
          });
        }

        return {
          text: combinedData.text,
          attachment: attachmentFile,
        };
      }

      return combinedData;
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

  static async decryptFile(
    encryptedData: string,
    iv: string,
    secretKey: string,
    linkId: string
  ): Promise<File> {
    const key = await this.deriveKey(secretKey, linkId);
    const decoder = new TextDecoder();

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: this.base64ToBuffer(iv),
      },
      key,
      this.base64ToBuffer(encryptedData)
    );

    // Parse the decrypted data to extract metadata and file content
    const fileWithMetadata = JSON.parse(decoder.decode(decrypted));
    const { metadata, data } = fileWithMetadata;

    // Convert array back to Uint8Array
    const fileBuffer = new Uint8Array(data);

    // Create a new File object from the decrypted data
    const blob = new Blob([fileBuffer], { type: metadata.mimeType });
    return new File([blob], metadata.fileName, {
      type: metadata.mimeType,
      lastModified: metadata.lastModified || Date.now(),
    });
  }
}
