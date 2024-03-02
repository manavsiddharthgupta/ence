/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,type]` on the table `UserAPILimit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserAPILimit_organizationId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserAPILimit_organizationId_type_key" ON "UserAPILimit"("organizationId", "type");
