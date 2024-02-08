/*
  Warnings:

  - Added the required column `organisationId` to the `CustomerInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomerInfo" ADD COLUMN     "organisationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CustomerInfo" ADD CONSTRAINT "CustomerInfo_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
