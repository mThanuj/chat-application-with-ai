/*
  Warnings:

  - You are about to drop the column `message` on the `AIChat` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `AIChat` table. All the data in the column will be lost.
  - Added the required column `prompt` to the `AIChat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AIChat" DROP CONSTRAINT "AIChat_user_id_fkey";

-- AlterTable
ALTER TABLE "AIChat" DROP COLUMN "message",
DROP COLUMN "user_id",
ADD COLUMN     "prompt" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AIChatSession" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "AIChatSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIChatSession" ADD CONSTRAINT "AIChatSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIChat" ADD CONSTRAINT "AIChat_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "AIChatSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
