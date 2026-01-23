/*
  Warnings:

  - You are about to drop the column `company_tag_id` on the `company_about` table. All the data in the column will be lost.
  - Added the required column `companyTagId` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "company_about" DROP CONSTRAINT "company_about_company_tag_id_fkey";

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "companyTagId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "company_about" DROP COLUMN "company_tag_id";

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_companyTagId_fkey" FOREIGN KEY ("companyTagId") REFERENCES "company_tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
