-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('Validator', 'Collator', 'Node');

-- CreateTable
CREATE TABLE "Node" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NodeType" NOT NULL DEFAULT 'Node',
    "network" TEXT NOT NULL,
    "subNetwork" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "city" TEXT,
    "periodFirstSeenId" INTEGER NOT NULL DEFAULT 0,
    "periodLastSeenId" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodesOnPeriods" (
    "nodeId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DayReport" (
    "id" SERIAL NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DayReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NodesOnDayReports" (
    "nodeId" INTEGER NOT NULL,
    "dayReportId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Node_name_type_network_subNetwork_latitude_longitude_key" ON "Node"("name", "type", "network", "subNetwork", "latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Period_start_end_key" ON "Period"("start", "end");

-- CreateIndex
CREATE UNIQUE INDEX "NodesOnPeriods_nodeId_periodId_key" ON "NodesOnPeriods"("nodeId", "periodId");

-- CreateIndex
CREATE UNIQUE INDEX "DayReport_day_key" ON "DayReport"("day");

-- CreateIndex
CREATE UNIQUE INDEX "NodesOnDayReports_nodeId_dayReportId_key" ON "NodesOnDayReports"("nodeId", "dayReportId");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_periodFirstSeenId_fkey" FOREIGN KEY ("periodFirstSeenId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_periodLastSeenId_fkey" FOREIGN KEY ("periodLastSeenId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodesOnPeriods" ADD CONSTRAINT "NodesOnPeriods_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodesOnPeriods" ADD CONSTRAINT "NodesOnPeriods_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodesOnDayReports" ADD CONSTRAINT "NodesOnDayReports_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NodesOnDayReports" ADD CONSTRAINT "NodesOnDayReports_dayReportId_fkey" FOREIGN KEY ("dayReportId") REFERENCES "DayReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
