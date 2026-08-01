-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "completionMode" TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN     "deadlineAt" TIMESTAMP(3),
ADD COLUMN     "memberLimit" INTEGER,
ADD COLUMN     "startsAt" TIMESTAMP(3);
