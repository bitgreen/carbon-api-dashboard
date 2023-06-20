// lib/prisma.ts
import { PrismaClient, Prisma } from "@prisma/client";

//Fetch the associated DApps for a given parachain
async function fetchSubnetworkDapps(name) {
  let prisma;

  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }

  const dapps = await prisma.dapps.findMany({
    where: {
      parachain: {
        endsWith: name,
      },
    },
    select: {
      name: true,
    },
    orderBy: {
      name: "desc",
    },
  });

  return dapps;
}

export default fetchSubnetworkDapps;
