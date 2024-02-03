-- CreateEnum
CREATE TYPE "SendMethods" AS ENUM ('MAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'DUE', 'PARTIALLY_PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "PaymentMethods" AS ENUM ('CASH', 'DIGITAL_WALLET');

-- CreateEnum
CREATE TYPE "PaymentTerms" AS ENUM ('IMMEDIATE', 'NET_15', 'NET_30', 'NET_60', 'NET_90', 'CUSTOM');

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" INTEGER NOT NULL,
    "sendingMethod" "SendMethods" NOT NULL,
    "customerInfo" JSONB NOT NULL,
    "dateIssue" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "shippingCharge" INTEGER,
    "paymentMethod" "PaymentMethods" NOT NULL DEFAULT 'CASH',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PAID',
    "paymentTerms" "PaymentTerms" NOT NULL DEFAULT 'CUSTOM',
    "notes" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "name" TEXT,
    "price" INTEGER,
    "quantity" INTEGER,
    "total" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceItem_id_key" ON "InvoiceItem"("id");

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
