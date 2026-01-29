/*
  Warnings:

  - You are about to drop the column `company_product_id` on the `company_session_product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id,company_session_id]` on the table `company_session_product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `company_session_product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "company_session_product" DROP CONSTRAINT "company_session_product_company_product_id_fkey";

-- DropIndex
DROP INDEX "company_session_product_company_product_id_company_session__key";

-- AlterTable
ALTER TABLE "company_session_product" DROP COLUMN "company_product_id",
ADD COLUMN     "product_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "company_session_product_product_id_company_session_id_key" ON "company_session_product"("product_id", "company_session_id");

-- AddForeignKey
ALTER TABLE "company_session_product" ADD CONSTRAINT "company_session_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
