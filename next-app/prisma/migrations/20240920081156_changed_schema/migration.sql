/*
  Warnings:

  - You are about to drop the column `email` on the `Data` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Data` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `phoneno` to the `Data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Data` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Data" DROP CONSTRAINT "Data_userId_fkey";

-- DropIndex
DROP INDEX "Data_email_key";

-- AlterTable
ALTER TABLE "Data" DROP COLUMN "email",
DROP COLUMN "userId",
ADD COLUMN     "phoneno" INTEGER NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- AddForeignKey
ALTER TABLE "Data" ADD CONSTRAINT "Data_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
