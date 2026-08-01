-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "collectionDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "collectionName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "coverImageUrl" TEXT;
