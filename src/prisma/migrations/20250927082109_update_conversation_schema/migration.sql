/*
  Warnings:

  - Added the required column `channel` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Conversation" ADD COLUMN     "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "channel" TEXT NOT NULL,
ADD COLUMN     "senderName" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'MESSAGE';
