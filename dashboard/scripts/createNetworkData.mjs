// lib/prisma.ts
import { PrismaClient, Prisma } from "@prisma/client";
import collateOverviewData from "./networkCalculation.mjs";

let prisma;
//Script to call calculation and push results to database
//Create prisma client instance
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

//Pull parachain data
const parachains = await prisma.parachains.findMany();

//Calculate emission data
let network = Prisma.UserCreateInput;
const overview = await collateOverviewData();

//Push data to database
const result = await prisma.overviewdata.create({
  data: overview,
});

console.log("RESULT", result);
