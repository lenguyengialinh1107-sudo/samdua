import { prisma } from "@/server/db";

export async function getSettingsMap(): Promise<Record<string, string>> {
  const rows = await prisma.storeSetting.findMany();
  return rows.reduce<Record<string, string>>((accumulator, row) => {
    accumulator[row.key] = row.value;
    return accumulator;
  }, {});
}

export async function upsertSetting(key: string, value: string) {
  return prisma.storeSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
