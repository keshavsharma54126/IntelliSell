/*
  Warnings:

  - A unique constraint covering the columns `[phoneno]` on the table `Data` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Data_name_key";

-- AlterTable
ALTER TABLE "Data" ALTER COLUMN "convoStarted" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Data_phoneno_key" ON "Data"("phoneno");
