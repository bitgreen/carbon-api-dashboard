import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { GetStaticProps } from "next";
import { signatureVerify } from "@polkadot/util-crypto";
import { dAppData } from "../../types";

export const getStaticProps: any = async () => {
  const dappData = await prisma.dapps.findMany({});
  const dappDataString = JSON.stringify(dappData);
  return {
    dappDataString,
  };
};
type Props = {
  dappDataString: string;
};
// POST /api/dapps
// Required fields in body: name, address, nodes, totalNodes
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Fetch nonce from database
  const props: any = await getStaticProps();
  const dappData = JSON.parse(props.dappDataString);
  const dappIndex = dappData.findIndex(
    (dapp: dAppData) => dapp.address === req.body.address
  );
  const nonce = dappData[dappIndex].nonce.toString();
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
      const result = await prisma.dapps.update({
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
