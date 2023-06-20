// lib/prisma.ts
import { PrismaClient, Prisma } from "@prisma/client";

//Simple script to fetch current overview ID
async function fetchOverviewID() {
  let prisma;

  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }

  const overviewid = await prisma.overviewdata.findFirst({
    select: {
      id: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return overviewid;
}

export default fetchOverviewID;
