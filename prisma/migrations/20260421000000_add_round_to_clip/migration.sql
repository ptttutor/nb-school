-- AlterTable: add roundId to SupervisionClip
ALTER TABLE "SupervisionClip" ADD COLUMN "roundId" TEXT;

-- AddForeignKey
ALTER TABLE "SupervisionClip" ADD CONSTRAINT "SupervisionClip_roundId_fkey"
  FOREIGN KEY ("roundId") REFERENCES "SupervisionRound"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "SupervisionClip_roundId_idx" ON "SupervisionClip"("roundId");
