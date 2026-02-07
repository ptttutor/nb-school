/*
  Warnings:

  - You are about to drop the column `gpa` on the `Registration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "gpa",
ADD COLUMN     "mathGradeM1" TEXT,
ADD COLUMN     "mathGradeM2" TEXT,
ADD COLUMN     "scienceGradeM1" TEXT,
ADD COLUMN     "scienceGradeM2" TEXT;
