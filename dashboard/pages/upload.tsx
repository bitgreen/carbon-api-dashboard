import React, { useState } from "react";
import { Divider, Card, Grid } from "@mui/material";
import Router, { withRouter } from "next/router";
import dynamic from "next/dynamic";
import { GetStaticProps } from "next";
const ParachainCard = dynamic(() => import("../components/ParachainCard"), {
  ssr: false,
});
import styles from "../styles/Home.module.css";
import prisma from "../lib/prisma";
import { server, parachain, dAppData } from "../types";

export const getStaticProps: GetStaticProps = async (context) => {
  const parachainData = await prisma.parachains.findMany({});
  const parachainDataString = JSON.stringify(parachainData);
  const dappData = await prisma.dapps.findMany({});
  const dappDataString = JSON.stringify(dappData);
  return {
    props: { parachainDataString, dappDataString },
    revalidate: 10,
  };
};

export const createParachainData = async (
  name: string,
  address: string,
  servers: server[],
  totalnodes: number,
  signature: string
) => {
  try {
    const body = { name, address, servers, totalnodes, signature };
    const updateParachain = await fetch(`/api/parachains`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await Router.push("/success");
  } catch (error) {
    console.error(error);
  }
};

export const createDappData = async (
  name: string,
  address: string,
  servers: server[],
  totalnodes: number,
  signature: string
) => {
  try {
    const body = { name, address, servers, totalnodes, signature };
    const updateDapp = await fetch(`/api/dapps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await Router.push("/success");
  } catch (error) {
    console.error(error);
  }
};

type Props = {
  router: any;
  parachainDataString: string;
  dappDataString: string;
};

//Parachain/DApp operator server data input page
const Upload: React.FC<Props> = (props) => {
  const parachainData = JSON.parse(props.parachainDataString);
  const dappData = JSON.parse(props.dappDataString);

  const [tooltipQuestion, setTooltipQuestion] = useState<string | null>(null);

  const returnTooltip = () => {
    switch (tooltipQuestion) {
      case "location":
        return (
          <Card className={styles.tooltipCard}>
            <h3 className={styles.tooltipTitle}>Location</h3>
            <h4 className={styles.tooltipText}>
              Include the location of your server
            </h4>
          </Card>
        );
      case "nodes":
        return (
          <Card className={styles.tooltipCard}>
            <h3 className={styles.tooltipTitle}>Total Nodes</h3>
            <h4 className={styles.tooltipText}>
              Include the number of nodes run from your server
            </h4>
          </Card>
        );
      case "hardware":
        return (
          <Card className={styles.tooltipCard}>
            <h3 className={styles.tooltipTitle}>Hardware</h3>
            <h4 className={styles.tooltipText} style={{ marginBottom: 10 }}>
              input the hardware size of the machine you use to run a node.{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              Small machines are defined as those running a CPU with a Thermal
              Design Power (TDP) of between 10 and 75 Watts, including commonly
              used machines such as:
            </h4>
            <h4 className={styles.tooltipText}>
              - Intel Core i5-10400 CPU @ 2.90GHz; i5-10400F CPU @ 2.90GHz
            </h4>
            <h4 className={styles.tooltipText}>
              - Intel Core i7-10700 CPU @ 2.90GHz; 8700 CPU @ 3.20GHz{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - Intel Core i9-10900 CPU @ 2.80GHz{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - Intel Celeron J4105 CPU @ 1.50GHz{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - AMD Ryzen 5 3600 6-Core Processor{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - AMD Ryzen 7 3700X 8-Core Processor{" "}
            </h4>
            <h4 className={styles.tooltipText} style={{ marginBottom: 10 }}>
              - AMD Ryzen 9 3900 12-Core Processor
            </h4>
            <h4 className={styles.tooltipText}>
              Medium machines are defined as those running a CPU with a TDP of
              between 75 and and 125 Watts, including machines such as:{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - Intel Xeon CPU E3-1245 V2 @ 3.40GHz; E5-2630 v4 @ 2.20GHz;
              E5-2620 v2 & v3 @ 2.40GH; E5-2640 v4 @ 2.40GHz; E-2386G CPU @
              3.50GHz; E-2388G CPU @ 3.20{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - 3.70GHz; Silver 4210R CPU @ 2.40GHz; Platinum 8252C CPU @
              3.80GHz{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - Intel Core i7-10700K CPU @ 3.80GHz{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - Intel Core i9-10900KF CPU @ 3.70GHz; i9-10850K CPU @ 3.60GHz;
              i9-10900K CPU @ 3.70GHz;{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - AMD Ryzen 5 3600X 6-Core Processor{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - AMD Ryzen 7 5800X 8-Core Processor{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - AMD Ryzen 9 5950X 16-Core Processor and 3900X 12-Core Processor{" "}
            </h4>
            <h4 className={styles.tooltipText}>- AMD EPYC 7571 </h4>
            <h4 className={styles.tooltipText} style={{ marginBottom: 10 }}>
              - AMD EPYC 7282 16-Core Processor
            </h4>
            <h4 className={styles.tooltipText}>
              Large machines are defined as those running a CPU with a TDP of
              above 125 Watts, including machines such as:{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - Intel Xeon W-1290P CPU @ 3.70GHz; CPU E5-1650 v3 @ 3.50GHz; CPU
              E5-2699 v3 @ 2.30GHz; Gold 6146 CPU @ 3.20GHz; Platinum 8259CL CPU
              @ 2.50GHz; Platinum 8275CL CPU @ 3.00GHz; Platinum 8375C CPU @
              2.90GHz{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - AMD EPYC 7502P 32-Core Processor{" "}
            </h4>
            <h4 className={styles.tooltipText}>
              - AMD EPYC 7513 32-Core Processor{" "}
            </h4>
            <h4 className={styles.tooltipText}>- AMD EPYC 7R13 Processor </h4>
            <h4 className={styles.tooltipText}>
              - AMD EPYC 7J13 64-Core Processor
            </h4>
          </Card>
        );
      case "renewables":
        return (
          <Card className={styles.tooltipCard}>
            <h3 className={styles.tooltipTitle}>Renewables</h3>
            <h4 className={styles.tooltipText} style={{ marginBottom: 10 }}>
              if the location you are operating nodes from consumes renewable
              energy, include the estimated amount (25%, 50%, 75% or 100%)
              below.
            </h4>
            <h4> </h4>
            <h4 className={styles.tooltipText} style={{ marginBottom: 10 }}>
              Locally generated energy comes from renewable energy assets, owned
              or supplying your building directly. This may come in the form of
              solar panels, or a private wire from a local renewable generator
              (e.g. wind turbine).
            </h4>
            <h4 className={styles.tooltipText} style={{ marginBottom: 10 }}>
              Procured renewable energy will come from a supplier who gives
              assurances that a certain amount of the energy supply comes from a
              renewable energy source.
            </h4>
          </Card>
        );
      default:
        return;
    }
  };

  //Pull the relevant server information - used to provide existing server data
  const returnServerData = (dataArray: any) => {
    const index = dataArray.findIndex(
      (data: any) =>
        data.address === JSON.parse(props.router.query.account).address
    );
    return dataArray[index].servers;
  };

  //Pull address from props
  const checkAddress = (
    parachainData: parachain[],
    dappData: dAppData[],
    props: Props
  ) => {
    if (props.router.query.account === undefined) {
      return (
        <Card className={styles.valuesCard}>
          <h3>
            No authorised parachains associated with this address. Please use a
            different address or contact Bitgreen.
          </h3>
        </Card>
      );
    }
    const address = JSON.parse(props.router.query.account).address;
    let approvedAddress = null;
    let approvedType: any = null;
    let approvedIndex: any = null;
    for (var i = 0; i < parachainData.length; i++) {
      if (address === parachainData[i].address) {
        approvedAddress = address;
        approvedIndex = i;
        approvedType = "parachain";
      }
    }
    for (var i = 0; i < dappData.length; i++) {
      if (address === dappData[i].address) {
        approvedAddress = address;
        approvedIndex = i;
        approvedType = "dapp";
      }
    }
    if (approvedAddress === null) {
      return (
        <Card className={styles.valuesCard}>
          <h3>
            No authorised parachains associated with this address. Please use a
            different address or contact Bitgreen.
          </h3>
        </Card>
      );
    } else if (approvedType === "parachain") {
      return (
        <div>
          <Grid container direction='column' spacing={3}>
            <Grid item>
              <Grid container direction='row' spacing={1}>
                <Grid item>
                  <h3>Name |</h3>
                </Grid>
                <Grid item>
                  <h3 className={styles.unitText}>
                    {parachainData[approvedIndex].name}
                  </h3>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction='row' spacing={1}>
                <Grid item>
                  <h3>Address |</h3>
                </Grid>
                <Grid item>
                  <h3 className={styles.unitText}>{approvedAddress}</h3>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <ParachainCard
                children={<div />}
                onServerSubmit={(servers: server[], signature: string) => {
                  handleServerUpdate(
                    servers,
                    signature,
                    approvedIndex,
                    approvedType
                  );
                }}
                existingServerData={returnServerData(parachainData)}
                account={JSON.parse(props.router.query.account)}
                nonce={parachainData[approvedIndex].nonce}
                onTooltip={(question: string | null) => {
                  setTooltipQuestion(question);
                }}
              />
            </Grid>
          </Grid>
          {returnTooltip()}
        </div>
      );
    } else if (approvedType === "dapp") {
      return (
        <div>
          <Grid container direction='column' spacing={3}>
            <Grid item>
              <Grid container direction='row' spacing={1}>
                <Grid item>
                  <h3>Name |</h3>
                </Grid>
                <Grid item>
                  <h3 className={styles.unitText}>
                    {dappData[approvedIndex].name}
                  </h3>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction='row' spacing={1}>
                <Grid item>
                  <h3>Address |</h3>
                </Grid>
                <Grid item>
                  <h3 className={styles.unitText}>{approvedAddress}</h3>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <ParachainCard
                children={<div />}
                onServerSubmit={(servers: server[], signature: string) => {
                  handleServerUpdate(
                    servers,
                    signature,
                    approvedIndex,
                    approvedType
                  );
                }}
                existingServerData={returnServerData(dappData)}
                account={JSON.parse(props.router.query.account)}
                nonce={dappData[approvedIndex].nonce}
                onTooltip={(question: string | null) => {
                  setTooltipQuestion(question);
                }}
              />
            </Grid>
          </Grid>
          {returnTooltip()}
        </div>
      );
    }
  };

  //Update database with newly created parachain/dapp information
  const handleServerUpdate = async (
    servers: server[],
    signature: string,
    index: number,
    type: string
  ) => {
    let nodeCount = 0;
    for (let i = 0; i < servers.length; i++) {
      nodeCount += servers[i].amount;
    }

    let nonce = 0;

    switch (type) {
      case "parachain":
        createParachainData(
          parachainData[index].name,
          parachainData[index].address,
          servers,
          nodeCount,
          signature
        );

        break;
      case "dapp":
        nonce = dappData[index].nonce;
        createDappData(
          dappData[index].name,
          dappData[index].address,
          servers,
          nodeCount,
          signature
        );
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Card className={styles.contentCard}>
        <h2>UPLOAD</h2>
        <div>
          <Divider />
          {props.router.isReady === true &&
            checkAddress(parachainData, dappData, props)}
        </div>
      </Card>
    </div>
  );
};

export default withRouter(Upload);
