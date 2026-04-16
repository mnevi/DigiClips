/*
  Warnings:

  - You are about to drop the column `recipient` on the `Email` table. All the data in the column will be lost.
  - Added the required column `to` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Draft" ADD COLUMN     "bcc" TEXT,
ADD COLUMN     "cc" TEXT,
ADD COLUMN     "to" TEXT;

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "recipient",
ADD COLUMN     "bcc" TEXT,
ADD COLUMN     "cc" TEXT,
ADD COLUMN     "to" TEXT NOT NULL;
