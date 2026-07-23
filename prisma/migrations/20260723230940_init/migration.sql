-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "xUsername" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "logoImageUrl" TEXT,
    "targetUsername" TEXT,
    "inviteStatus" TEXT NOT NULL DEFAULT 'pending',
    "inviteExpiresAt" TIMESTAMP(3),
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;
