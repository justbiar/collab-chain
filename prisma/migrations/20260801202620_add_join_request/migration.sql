-- CreateTable
CREATE TABLE "JoinRequest" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "xUsername" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JoinRequest_collectionId_idx" ON "JoinRequest"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "JoinRequest_collectionId_xUsername_key" ON "JoinRequest"("collectionId", "xUsername");
