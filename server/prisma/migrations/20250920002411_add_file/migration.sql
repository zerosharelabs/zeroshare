-- AlterTable
ALTER TABLE "public"."organization" ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE "public"."secret" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text';
