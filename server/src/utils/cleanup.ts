import dayjs from "dayjs";
import prisma from "@/config/database";
import { getBytes } from ".";
import { incrementStat } from "./stats";

const revokeShare = async (id: string, data: string) => {
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

export async function deleteExpiredShares() {
  const startTime = Date.now();
  let deletedCount = 0;
  let errorCount = 0;
  try {
    const shares = await prisma.secret.findMany({
      where: { expiresAt: { lte: dayjs().toDate() } },
      select: { id: true, encryptedData: true },
    });
    if (shares.length > 0) {
      const BATCH_SIZE = 50;
      for (let i = 0; i < shares.length; i += BATCH_SIZE) {
        const batch = shares.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (share: { id: string; encryptedData: string }) => {
            try {
              await revokeShare(share.id, share.encryptedData);
              deletedCount++;
            } catch {
              errorCount++;
            }
          })
        );
      }
      const duration = Date.now() - startTime;
      console.log(
        `Cleanup completed in ${duration}ms\nShares processed: ${shares.length}\nSuccessfully cleared: ${deletedCount}\nFailed clearings: ${errorCount}`
      );
    }
  } catch {}
}
