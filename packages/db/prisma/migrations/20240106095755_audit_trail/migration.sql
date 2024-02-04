-- CreateEnum
CREATE TYPE "InvoiceApprovalStatus" AS ENUM ('UNAPPROVED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReceiptSendStatus" AS ENUM ('SENT', 'NOT_SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('INVOICE_CREATION', 'APPROVAL_ACTION', 'PAYMENT_STATUS_CHANGE', 'RECEIPT_SEND_STATUS_CHANGE');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "approvalStatus" "InvoiceApprovalStatus" NOT NULL DEFAULT 'UNAPPROVED',
ADD COLUMN     "receiptSendStatus" "ReceiptSendStatus" NOT NULL DEFAULT 'NOT_SENT',
ALTER COLUMN "paymentStatus" SET DEFAULT 'DUE',
ALTER COLUMN "paymentTerms" SET DEFAULT 'IMMEDIATE';

-- CreateTable
CREATE TABLE "AuditTrail" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionType" "ActionType" NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "AuditTrail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditTrail" ADD CONSTRAINT "AuditTrail_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
