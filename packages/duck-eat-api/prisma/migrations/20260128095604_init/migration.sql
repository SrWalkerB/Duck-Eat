/*
  Warnings:

  - You are about to drop the column `company_product_id` on the `product_photos` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `product_photos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_photos" DROP CONSTRAINT "product_photos_company_product_id_fkey";

-- AlterTable
ALTER TABLE "product_photos" DROP COLUMN "company_product_id",
ADD COLUMN     "product_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "product_photos" ADD CONSTRAINT "product_photos_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
