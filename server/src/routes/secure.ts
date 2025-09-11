import { Router, Request, Response } from "express";
import dayjs from "dayjs";

import { hashPassword, verifyPassword } from "@/utils/password";
import {
  decrypt,
  encrypt,
  updateAccessAttempts,
  updatePasswordAttempts,
} from "@/config/encryption";
import { incrementStat } from "@/utils/stats";
import { TimeUnit } from "@/utils/types";
import prisma from "@/config/database";
import { getBytes } from "@/utils";
import {
  validateCreateSecureShare,
  validateLinkId,
  validatePassword,
} from "@/utils/validation";
import { authorized } from "@/middleware";

const router = Router();

interface SecureParams {
  linkId: string;
}

export async function createSecureShare(
  req: Request,
  res: Response
): Promise<Response | void> {
  try {
    const {
      linkId,
      encryptedData,
      iv,
      expiresIn = 60 * 60 * 24,
      password,
    } = req.body;

    let hashedPassword;
    if (password) {
      try {
        hashedPassword = await hashPassword(password);
      } catch (hashError) {
        console.error("Password hashing failed:", hashError);
        return res.status(500).json({ error: "Failed to process password" });
      }
    }

    const {
      encryptedData: serverEncryptedData,
      iv: serverIV,
      tag: serverTag,
    } = encrypt(encryptedData);

    await prisma.secret.create({
      data: {
        linkId,
        encryptedData: `${serverEncryptedData}#${serverTag}`,
        iv: `${iv}#${serverIV}`,
        passwordHash: hashedPassword,
        expiresAt: dayjs().add(expiresIn, "second").toDate(),
        accountId: req.account?.id,
        userId: req.user?.id,
      },
    });

    try {
      await incrementStat("links_created", 1);
      if (hashedPassword) {
        await incrementStat("links_created_with_password", 1);
      }
    } catch (statError) {
      console.error("Failed to increment stats:", statError);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to store data:", error);
    res.status(500).json({ error: "Failed to create secure share" });
  }
}

export async function getSecureShareInitialInformation(
  req: Request<SecureParams>,
  res: Response
): Promise<Response | void> {
  try {
    const { linkId } = req.params;
    const share = await prisma.secret.findUnique({
      where: {
        linkId,
      },
    });

    if (!share) {
      res.status(404).json({
        error:
          "This secret does not exist, has already been viewed or has been deleted or expired. If it was not you who viewed the secret, please notify the link sender that the secret has already been viewed.",
      });
      return;
    }

    res.status(200).json({
      protected: !!share?.passwordHash,
    });
  } catch (error) {
    console.error("Share retrieval failed:", error);
    res.status(500).json({
      error:
        "This secret does not exist, has already been viewed or has been deleted or expired. If it was not you who viewed the secret, please notify the link sender that the secret has already been viewed.",
    });
  }
}

export async function retrieveSecureShare(
  req: Request<SecureParams>,
  res: Response
): Promise<Response | void> {
  try {
    const { password } = req.body;
    const { linkId } = req.params;
    const secureShare = await prisma.secret.findUnique({
      where: {
        linkId,
      },
    });

    if (!secureShare) {
      res.status(404).json({
        error:
          "This secret does not exist, has already been viewed or has been deleted or expired. If it was not you who viewed the secret, please notify the link sender that the secret has already been viewed.",
      });
      return;
    }

    if (
      dayjs().toDate() > dayjs(secureShare.expiresAt).toDate() ||
      secureShare.accessAttempts >= 1
    ) {
      await revokeShare(secureShare.id, secureShare.encryptedData);

      res.status(404).json({
        error:
          "This secret does not exist, has already been viewed or has been deleted or expired. If it was not you who viewed the secret, please notify the link sender that the secret has already been viewed.",
      });
      return;
    }

    let isValidPassword = false;
    if (secureShare.passwordHash) {
      try {
        isValidPassword = await verifyPassword(
          secureShare.passwordHash,
          password
        );
        if (!isValidPassword) {
          const nextAttemptCount = secureShare.passwordAttempts + 1;
          const maxAttempts = secureShare.maxPasswordAttempts;

          if (nextAttemptCount >= maxAttempts) {
            await updatePasswordAttempts(secureShare.id);
            await revokeShare(secureShare.id, secureShare.encryptedData);

            return res.status(404).json({
              error:
                "Maximum password attempts exceeded. The secret has now been destroyed. If it was not you who attempted the passwords, please notify the link sender that the secret has been destroyed.",
            });
          }

          await updatePasswordAttempts(secureShare.id);
          const attemptsLeft = maxAttempts - nextAttemptCount;

          return res.status(401).json({
            error: `You entered an invalid password. You have ${attemptsLeft} attempts left. If you exceed the maximum attempts, the secret will be destroyed.`,
          });
        }
      } catch (hashError) {
        console.error("Password verification failed:", hashError);

        return res.status(500).json({
          error:
            "Some unknown error happened. Please try again later or notify the sender to create another link.",
        });
      }
    }

    const [clientIV, serverIV] = secureShare.iv.split("#");
    const [encryptedData, tag] = secureShare.encryptedData.split("#");

    const result = decrypt(encryptedData, serverIV, tag);

    await updateAccessAttempts(secureShare.id);

    await incrementStat("links_viewed", 1);
    if (isValidPassword) {
      await incrementStat("links_viewed_with_password", 1);
    }

    await revokeShare(secureShare.id, secureShare.encryptedData);

    res.status(200).json({
      encryptedData: result.decryptedData,
      iv: clientIV,
    });
  } catch (error) {
    console.error("Share retrieval failed:", error);

    res.status(500).json({
      error:
        "This secret does not exist, has already been viewed or has been deleted or expired. If it was not you who viewed the secret, please notify the link sender that the secret has already been viewed.",
    });
  }
}

export const revokeShare = async (id: string, data: string) => {
  await prisma.secret.update({
    where: { id },
    data: {
      encryptedData: "0",
      passwordHash: "0",
      iv: "0",
      expiresAt: new Date(),
    },
  });
  const byteSize = getBytes(data);
  await incrementStat("bytes_destroyed", byteSize);
};

export const deleteShare = async (id: string) => {
  const share = await prisma.secret.findUnique({
    where: { id },
  });
  if (share && share.encryptedData !== "0") {
    const byteSize = getBytes(share.encryptedData);
    await incrementStat("bytes_destroyed", byteSize);
  }
  await prisma.secret.delete({
    where: { id },
  });
};

export const revokeSecureShareHandler = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const secureShare = await prisma.secret.findUnique({
      where: {
        id,
      },
    });

    if (req.user && secureShare?.userId !== req.user.id) {
      return res.status(403).json({ error: "You do not have permission" });
    }

    if (!secureShare) {
      return res.status(404).json({ error: "Secure share not found" });
    }

    await revokeShare(secureShare.id, secureShare.encryptedData);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to revoke secure share:", error);
    return res.status(500).json({ error: "Failed to revoke secure share" });
  }
};

export const deleteSecureShareHandler = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const secureShare = await prisma.secret.findUnique({
      where: {
        id,
      },
    });

    if (!secureShare) {
      return res.status(404).json({ error: "Secure share not found" });
    }

    if (req.user && secureShare?.userId !== req.user.id) {
      return res.status(403).json({ error: "You do not have permission" });
    }

    await deleteShare(secureShare.id);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to delete secure share:", error);
    return res.status(500).json({ error: "Failed to delete secure share" });
  }
};

// Routes
router.post(
  "/",
  validateCreateSecureShare,
  validatePassword,
  authorized,
  createSecureShare as any
);
router.get("/:linkId", validateLinkId, getSecureShareInitialInformation as any);
router.post(
  "/:linkId",
  validateLinkId,
  validatePassword,
  retrieveSecureShare as any
);

export default router;
