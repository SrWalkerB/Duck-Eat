/*
  Warnings:

  - You are about to drop the `CompanyProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompanySession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanySession" DROP CONSTRAINT "CompanySession_company_id_fkey";

-- DropForeignKey
ALTER TABLE "company_product_photos" DROP CONSTRAINT "company_product_photos_company_product_id_fkey";

-- DropForeignKey
ALTER TABLE "company_session_product" DROP CONSTRAINT "company_session_product_company_product_id_fkey";

-- DropForeignKey
ALTER TABLE "company_session_product" DROP CONSTRAINT "company_session_product_company_session_id_fkey";

-- DropTable
DROP TABLE "CompanyProduct";

-- DropTable
DROP TABLE "CompanySession";

-- CreateTable
CREATE TABLE "company_session" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "company_id" TEXT NOT NULL,

    CONSTRAINT "company_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_product" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "company_product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "company_session" ADD CONSTRAINT "company_session_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_product_photos" ADD CONSTRAINT "company_product_photos_company_product_id_fkey" FOREIGN KEY ("company_product_id") REFERENCES "company_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_session_product" ADD CONSTRAINT "company_session_product_company_product_id_fkey" FOREIGN KEY ("company_product_id") REFERENCES "company_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_session_product" ADD CONSTRAINT "company_session_product_company_session_id_fkey" FOREIGN KEY ("company_session_id") REFERENCES "company_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
