-- CreateTable
CREATE TABLE "Alias" (
    "id" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "visitCount" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Alias_id_key" ON "Alias"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Alias_alias_key" ON "Alias"("alias");
