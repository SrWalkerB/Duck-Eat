/*
  Warnings:

  - Changed the type of `role` on the `account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ROLES" AS ENUM ('ADMIN', 'CLIENT', 'RESTAURANT_ADMIN');

-- AlterTable
ALTER TABLE "account" DROP COLUMN "role",
ADD COLUMN     "role" "ROLES" NOT NULL;

-- DropEnum
DROP TYPE "Role";
