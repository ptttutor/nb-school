/*
  Warnings:

  - Made the column `idCardOrPassport` on table `Registration` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Registration" ALTER COLUMN "idCardOrPassport" SET NOT NULL;
