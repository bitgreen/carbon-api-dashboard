// lib/prisma.ts
import { PrismaClient, Prisma } from "@prisma/client";

//Fetch the most recent subnetwork ID
async function fetchSubnetworkID() {
  let prisma;

  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }

  const subnetworkid = await prisma.subnetworkdata.findFirst({
    select: {
      subnetworkid: true,
    },
    orderBy: {
      subnetworkid: "desc",
    },
  });

  return subnetworkid;
}

export default fetchSubnetworkID;
