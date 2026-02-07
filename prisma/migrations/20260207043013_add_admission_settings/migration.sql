-- CreateTable
CREATE TABLE "AdmissionSettings" (
    "id" TEXT NOT NULL,
    "gradeLevel" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "schedule" TEXT,
    "requirements" TEXT,
    "announcement" TEXT,
    "allowISM" BOOLEAN NOT NULL DEFAULT true,
    "allowRegular" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdmissionSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdmissionSettings_gradeLevel_key" ON "AdmissionSettings"("gradeLevel");

-- CreateIndex
CREATE INDEX "AdmissionSettings_gradeLevel_idx" ON "AdmissionSettings"("gradeLevel");
