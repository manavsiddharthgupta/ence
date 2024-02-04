/*
  Warnings:

  - The values [INVOICE_CREATION] on the enum `ActionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActionType_new" AS ENUM ('MANUAL_CREATION', 'INSTANT_CREATION', 'APPROVAL_ACTION', 'PAYMENT_STATUS_CHANGE', 'RECEIPT_SEND_STATUS_CHANGE');
ALTER TABLE "AuditTrail" ALTER COLUMN "actionType" TYPE "ActionType_new" USING ("actionType"::text::"ActionType_new");
ALTER TYPE "ActionType" RENAME TO "ActionType_old";
ALTER TYPE "ActionType_new" RENAME TO "ActionType";
DROP TYPE "ActionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "AuditTrail" ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT;
