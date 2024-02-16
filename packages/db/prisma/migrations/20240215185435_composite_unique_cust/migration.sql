/*
  Warnings:

  - A unique constraint covering the columns `[whatsAppNumber,email,organisationId]` on the table `CustomerInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CustomerInfo_email_key";

-- DropIndex
DROP INDEX "CustomerInfo_whatsAppNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "CustomerInfo_whatsAppNumber_email_organisationId_key" ON "CustomerInfo"("whatsAppNumber", "email", "organisationId");
