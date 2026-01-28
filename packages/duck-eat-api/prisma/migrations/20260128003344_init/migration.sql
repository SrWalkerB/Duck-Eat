/*
  Warnings:

  - You are about to drop the `company_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_product_photos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "company_product" DROP CONSTRAINT "company_product_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "company_product_photos" DROP CONSTRAINT "company_product_photos_company_product_id_fkey";

-- DropForeignKey
ALTER TABLE "company_session_product" DROP CONSTRAINT "company_session_product_company_product_id_fkey";

-- DropTable
DROP TABLE "company_product";

-- DropTable
DROP TABLE "company_product_photos";

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_photos" (
    "id" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "company_product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_photos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_photos" ADD CONSTRAINT "product_photos_company_product_id_fkey" FOREIGN KEY ("company_product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_session_product" ADD CONSTRAINT "company_session_product_company_product_id_fkey" FOREIGN KEY ("company_product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
