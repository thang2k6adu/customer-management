-- CreateEnum
CREATE TYPE "public"."TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."TicketType" AS ENUM ('INCIDENT', 'QUESTION', 'TASK', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "priority" "public"."TicketPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "type" "public"."TicketType" NOT NULL DEFAULT 'INCIDENT';

-- CreateTable
CREATE TABLE "public"."_TicketFollowers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TicketFollowers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TicketFollowers_B_index" ON "public"."_TicketFollowers"("B");

-- AddForeignKey
ALTER TABLE "public"."_TicketFollowers" ADD CONSTRAINT "_TicketFollowers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TicketFollowers" ADD CONSTRAINT "_TicketFollowers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
