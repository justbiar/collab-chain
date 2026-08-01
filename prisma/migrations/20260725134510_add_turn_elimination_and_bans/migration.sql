-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "chainStatus" TEXT NOT NULL DEFAULT 'live',
ADD COLUMN     "eliminatedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "turnExpiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BannedUser" (
    "id" SERIAL NOT NULL,
    "xUsername" TEXT NOT NULL,
    "cardId" INTEGER,
    "bannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BannedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BannedUser_xUsername_key" ON "BannedUser"("xUsername");

-- CreateIndex
CREATE INDEX "Card_parentId_idx" ON "Card"("parentId");

-- CreateIndex
CREATE INDEX "Card_xUsername_idx" ON "Card"("xUsername");
