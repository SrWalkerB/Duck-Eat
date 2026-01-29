/*
  Warnings:

  - You are about to drop the column `photo_url` on the `product_photos` table. All the data in the column will be lost.
  - Added the required column `photo_url_key` to the `product_photos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_photos" DROP COLUMN "photo_url",
ADD COLUMN     "photo_url_key" TEXT NOT NULL;
