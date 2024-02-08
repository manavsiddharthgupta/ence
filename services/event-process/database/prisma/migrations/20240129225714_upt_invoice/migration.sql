/*
  Warnings:

  - Added the required column `name` to the `InvoiceRelatedDocument` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RelatedDocName" AS ENUM ('MAIN_PDF', 'MAIN_IMAGE', 'DOWNLOAD_PDF', 'OTHERS');

-- AlterTable
ALTER TABLE "InvoiceRelatedDocument" ADD COLUMN     "name" "RelatedDocName" NOT NULL;
