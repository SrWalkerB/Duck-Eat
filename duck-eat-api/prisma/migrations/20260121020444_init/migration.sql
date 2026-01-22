/*
  Warnings:

  - You are about to drop the column `companyTagId` on the `company` table. All the data in the column will be lost.
  - Added the required column `company_tag_id` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "company" DROP CONSTRAINT "company_companyTagId_fkey";

-- AlterTable
ALTER TABLE "company" DROP COLUMN "companyTagId",
ADD COLUMN     "company_tag_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_company_tag_id_fkey" FOREIGN KEY ("company_tag_id") REFERENCES "company_tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
