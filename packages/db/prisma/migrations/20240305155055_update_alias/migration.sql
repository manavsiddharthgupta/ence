/*
  Warnings:

  - You are about to drop the `Alias` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TokenTypes" AS ENUM ('INV_APPROVE', 'INV_REJECT');

-- DropTable
DROP TABLE "Alias";

-- CreateTable
CREATE TABLE "Tokens" (
    "id" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "type" "TokenTypes" NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "invoiceId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_id_key" ON "Tokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_target_key" ON "Tokens"("target");

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
