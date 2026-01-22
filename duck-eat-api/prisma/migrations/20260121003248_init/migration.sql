-- AlterTable
ALTER TABLE "company_opening_hours" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "company_tag" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "opening_week_day" ADD COLUMN     "deleted_at" TIMESTAMP(3);
