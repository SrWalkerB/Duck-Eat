/*
  Warnings:

  - You are about to drop the column `accountId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[account_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `user` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `user` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updated_at` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MASTER_ADMIN', 'CLIENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "CompanyLogoContext" AS ENUM ('PROFILE', 'COVER');

-- CreateEnum
CREATE TYPE "PaymentContext" AS ENUM ('ON_DELIVERY', 'IN_PERSON');

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_accountId_fkey";

-- DropIndex
DROP INDEX "user_accountId_key";

-- AlterTable
ALTER TABLE "account" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "role" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "accountId",
ADD COLUMN     "account_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "trade_name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_about" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "company_tag_id" TEXT,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_about_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_logo" (
    "id" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "context" "CompanyLogoContext" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "company_id" TEXT NOT NULL,

    CONSTRAINT "company_logo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opening_week_day" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opening_week_day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_opening_hours" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "opening_week_day_id" TEXT NOT NULL,

    CONSTRAINT "company_opening_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_payment_method" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "payment_method_id" TEXT NOT NULL,
    "payment_context" "PaymentContext" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_method" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanySession" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "company_id" TEXT NOT NULL,

    CONSTRAINT "CompanySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProduct" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CompanyProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_product_photos" (
    "id" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "company_product_id" TEXT NOT NULL,

    CONSTRAINT "company_product_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_session_product" (
    "id" TEXT NOT NULL,
    "company_product_id" TEXT NOT NULL,
    "company_session_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "company_session_product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opening_week_day_tag_key" ON "opening_week_day"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "company_payment_method_company_id_payment_method_id_key" ON "company_payment_method"("company_id", "payment_method_id");

-- CreateIndex
CREATE INDEX "payment_method_tag_idx" ON "payment_method"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "company_session_product_company_product_id_company_session__key" ON "company_session_product"("company_product_id", "company_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_id_key" ON "user"("account_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_logo" ADD CONSTRAINT "company_logo_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_opening_hours" ADD CONSTRAINT "company_opening_hours_opening_week_day_id_fkey" FOREIGN KEY ("opening_week_day_id") REFERENCES "opening_week_day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_payment_method" ADD CONSTRAINT "company_payment_method_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_payment_method" ADD CONSTRAINT "company_payment_method_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanySession" ADD CONSTRAINT "CompanySession_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_product_photos" ADD CONSTRAINT "company_product_photos_company_product_id_fkey" FOREIGN KEY ("company_product_id") REFERENCES "CompanyProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_session_product" ADD CONSTRAINT "company_session_product_company_product_id_fkey" FOREIGN KEY ("company_product_id") REFERENCES "CompanyProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_session_product" ADD CONSTRAINT "company_session_product_company_session_id_fkey" FOREIGN KEY ("company_session_id") REFERENCES "CompanySession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
