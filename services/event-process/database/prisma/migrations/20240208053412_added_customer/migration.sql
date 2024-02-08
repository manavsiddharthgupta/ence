/*
  Warnings:

  - You are about to drop the column `customerInfo` on the `Invoice` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "customerInfo",
ADD COLUMN     "customerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CustomerInfo" (
    "id" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "whatsAppNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "CustomerInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerInfo_whatsAppNumber_key" ON "CustomerInfo"("whatsAppNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerInfo_email_key" ON "CustomerInfo"("email");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
