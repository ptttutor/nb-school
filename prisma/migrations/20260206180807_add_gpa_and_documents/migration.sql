-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "gpa" TEXT;
