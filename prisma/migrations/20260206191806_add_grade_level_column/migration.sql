-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "gradeLevel" TEXT NOT NULL DEFAULT 'm1',
ALTER COLUMN "isSpecialISM" SET DEFAULT true;
