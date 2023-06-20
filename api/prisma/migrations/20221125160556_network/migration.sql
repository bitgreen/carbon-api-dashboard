/*
  Warnings:

  - You are about to drop the column `network` on the `Node` table. All the data in the column will be lost.
  - You are about to drop the column `subNetwork` on the `Node` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,type,networkId,latitude,longitude]` on the table `Node` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Node_name_type_network_subNetwork_latitude_longitude_key";

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "network",
DROP COLUMN "subNetwork",
ADD COLUMN     "networkId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Network" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentNetworkId" INTEGER,
    "hash" TEXT NOT NULL,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Network_name_key" ON "Network"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Network_hash_key" ON "Network"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Node_name_type_networkId_latitude_longitude_key" ON "Node"("name", "type", "networkId", "latitude", "longitude");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Network" ADD CONSTRAINT "Network_parentNetworkId_fkey" FOREIGN KEY ("parentNetworkId") REFERENCES "Network"("id") ON DELETE SET NULL ON UPDATE CASCADE;
