-- CreateTable
CREATE TABLE "GenesisGrant" (
    "id" SERIAL NOT NULL,
    "xUsername" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenesisGrant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GenesisGrant_xUsername_key" ON "GenesisGrant"("xUsername");
