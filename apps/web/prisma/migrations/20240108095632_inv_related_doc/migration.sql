-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "instantInvoiceLink" TEXT;

-- CreateTable
CREATE TABLE "InvoiceRelatedDocument" (
    "id" TEXT NOT NULL,
    "documentLink" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "InvoiceRelatedDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvoiceRelatedDocument" ADD CONSTRAINT "InvoiceRelatedDocument_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
