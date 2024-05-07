-- CreateTable
CREATE TABLE "StripeAccount" (
    "id" TEXT NOT NULL,
    "apiToken" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,

    CONSTRAINT "StripeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeAccount_apiToken_key" ON "StripeAccount"("apiToken");

-- AddForeignKey
ALTER TABLE "StripeAccount" ADD CONSTRAINT "StripeAccount_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
