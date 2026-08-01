import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
const envLocalPath = path.resolve(process.cwd(), ".env.local");

function loadEnvFile(p: string) {
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || "";
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  }
}

loadEnvFile(envPath);
loadEnvFile(envLocalPath);

async function main() {
  const { prisma } = await import("../lib/prisma");

  console.log("Veritabanı temizleniyor...");
  const cardsBefore = await prisma.card.count();
  const bansBefore = await prisma.bannedUser.count();
  console.log(`Mevcut: ${cardsBefore} kart, ${bansBefore} yasaklı hesap`);

  // Yasaklar kartlara referans verdiği için önce onlar siliniyor. Kartlar
  // gidince ban kayıtları da anlamsız kalır — ikisi birlikte sıfırlanmalı.
  await prisma.bannedUser.deleteMany({});
  await prisma.card.deleteMany({});

  console.log(
    `Temizlik sonrası: ${await prisma.card.count()} kart, ${await prisma.bannedUser.count()} yasaklı hesap`
  );
  console.log("Veritabanı sıfırlandı!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Sıfırlama hatası:", e);
  process.exit(1);
});

