/*
  Warnings:

  - Added the required column `accountId` to the `StripeAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StripeAccount" ADD COLUMN     "accountId" TEXT NOT NULL;
