/*
  Warnings:

  - The `available` column on the `Listing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `availableFrom` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "availableFrom" TIMESTAMP(3) NOT NULL,
DROP COLUMN "available",
ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true;
