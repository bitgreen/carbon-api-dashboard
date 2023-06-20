import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { GetStaticProps } from "next";
import { signatureVerify } from "@polkadot/util-crypto";
import { parachain } from "../../types";

export const getStaticProps: any = async () => {
  const parachainData = await prisma.parachains.findMany({});
  const parachainDataString = JSON.stringify(parachainData);
  return {
    parachainDataString,
  };
};
type Props = {
  parachainDataString: string;
};
// POST /api/parachains
// Required fields in body: name, address, nodes, totalNodes
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Fetch nonce from database
  const props = await getStaticProps();
  const parachainData = JSON.parse(props.parachainDataString);
  const parachainIndex = parachainData.findIndex(
    (parachain: parachain) => parachain.address === req.body.address
  );
  const nonce = parachainData[parachainIndex].nonce.toString();
  //Decode address using signature
  //Check if decoded address matches provided address
  try {
    const { isValid } = signatureVerify(
      nonce,
      req.body.signature,
      req.body.address
    );
    console.log(`${req.body.signature} is ${isValid ? "valid" : "invalid"}`);
    if (isValid) {
      //Remove signature from body
      const dataCopy = req.body;
      delete dataCopy.signature;
      //Create new nonce
      req.body.nonce = parseInt(
        (Math.random() * (999999999 - 100000000) + 100000000).toFixed(0)
      );
      //Push to database
      const result = await prisma.parachains.update({
        where: {
          address: dataCopy.address,
        },
        data: {
          ...dataCopy,
        },
      });
      res.json(result);
    }
  } catch (error) {
    console.error(error);
  }
}
