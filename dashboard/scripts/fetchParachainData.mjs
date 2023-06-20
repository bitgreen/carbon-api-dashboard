// lib/prisma.ts
import { PrismaClient, Prisma } from "@prisma/client";

//Fetch current parachain data
async function fetchParachainData() {
  let prisma;

  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }

  const parachains = await prisma.parachains.findMany();

  // console.log(parachains);

  return parachains;
}

export default fetchParachainData;
