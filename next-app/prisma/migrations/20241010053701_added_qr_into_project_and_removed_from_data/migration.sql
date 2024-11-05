/*
  Warnings:

  - You are about to drop the column `qrCode` on the `Data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Data" DROP COLUMN "qrCode";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "qrCode" TEXT;
