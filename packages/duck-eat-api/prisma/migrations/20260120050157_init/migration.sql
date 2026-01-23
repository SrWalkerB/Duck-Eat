/*
  Warnings:

  - Made the column `company_tag_id` on table `company_about` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "company" ADD COLUMN     "company_about_id" TEXT;

-- AlterTable
ALTER TABLE "company_about" ADD COLUMN     "deleteAt" TIMESTAMP(3),
ALTER COLUMN "company_tag_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_company_about_id_fkey" FOREIGN KEY ("company_about_id") REFERENCES "company_about"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_about" ADD CONSTRAINT "company_about_company_tag_id_fkey" FOREIGN KEY ("company_tag_id") REFERENCES "company_tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
