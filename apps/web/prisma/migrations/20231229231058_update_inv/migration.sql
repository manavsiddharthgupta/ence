/*
  Warnings:

  - Added the required column `invoiceTotal` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTotal` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "discount" INTEGER,
ADD COLUMN     "invoiceTotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "subTotal" DOUBLE PRECISION NOT NULL;
