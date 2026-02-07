/*
  Warnings:

  - You are about to drop the column `birthMonth` on the `Registration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "birthMonth",
ADD COLUMN     "educationStatus" TEXT,
ADD COLUMN     "schoolDistrict" TEXT,
ADD COLUMN     "schoolName" TEXT,
ADD COLUMN     "schoolProvince" TEXT,
ADD COLUMN     "schoolSubdistrict" TEXT;
