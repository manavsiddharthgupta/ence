/*
  Warnings:

  - Added the required column `dueAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "dueAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "sendingMethod" SET DEFAULT 'MAIL',
ALTER COLUMN "notes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "whatsappNumber" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
