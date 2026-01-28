/*
  Warnings:

  - You are about to drop the column `company_id` on the `company_product` table. All the data in the column will be lost.
  - Added the required column `organization_id` to the `company_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company_product" DROP COLUMN "company_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "company_product" ADD CONSTRAINT "company_product_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
