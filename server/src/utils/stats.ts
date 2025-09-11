import prisma from "@/config/database";

export const incrementStat = async (name: string, value: number = 1) => {
  await prisma.statistic.upsert({
    where: { name: name },
    update: { value: { increment: value } },
    create: { name: name, value: value },
  });
};
