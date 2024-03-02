-- CreateEnum
CREATE TYPE "APILimit" AS ENUM ('RESEND_MAIL', 'INSTANT_INVOICE');

-- CreateTable
CREATE TABLE "UserAPILimit" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "type" "APILimit" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAPILimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAPILimit_organizationId_key" ON "UserAPILimit"("organizationId");
