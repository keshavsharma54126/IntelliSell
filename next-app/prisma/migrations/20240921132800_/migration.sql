-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "image" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
