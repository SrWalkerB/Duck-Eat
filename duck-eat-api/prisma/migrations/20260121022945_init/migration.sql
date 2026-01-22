/*
  Warnings:

  - A unique constraint covering the columns `[tag]` on the table `payment_method` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "payment_method_tag_idx";

-- CreateIndex
CREATE UNIQUE INDEX "payment_method_tag_key" ON "payment_method"("tag");
