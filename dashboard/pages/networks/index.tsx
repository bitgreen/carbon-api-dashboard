import type { GetStaticProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Button, Grid, Card, Divider } from "@mui/material";
import NestedPieChart from "../../components/NestedPieChart";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import prisma from "../../lib/prisma";
import { subnetworkName } from "../../types";
import Footer from "../../components/Footer";

export async function getStaticProps() {
  // Return a list of possible value for id
  const parachainData = await prisma.parachains.findMany({});
  const paths = parachainData.map((parachain) => ({
    params: {
      name: parachain.name,
      //subnetworks: parachain.subnetwork
    },
  }));
  let polkadotEmissionsData = await prisma.networkdata.findMany({
    where: {
      name: {
        endsWith: "POLKADOT",
      },
    },
    orderBy: {
      networkid: "asc",
    },
    select: {
      name: true,
      totalpower: true,
      totalemissions: true,
    },
  });
  let kusamaEmissionsData = await prisma.networkdata.findMany({
    where: {
      name: {
        endsWith: "KUSAMA",
      },
    },
    orderBy: {
      networkid: "asc",
    },
    select: {
      name: true,
      totalpower: true,
      totalemissions: true,
    },
  });
  const latestOverviewId: any = await prisma.overviewdata.findFirst({
    orderBy: {
      timestamp: "desc",
    },
    select: {
      id: true,
    },
  });
  const polkadotSubnetworks = await prisma.subnetworkdata.findMany({
    where: {
      networkname: "POLKADOT",
      overviewid: latestOverviewId.id,
    },
    select: {
      subnetworkname: true,
    },
  });
  const kusamaSubnetworks = await prisma.subnetworkdata.findMany({
    where: {
      networkname: "KUSAMA",
      overviewid: latestOverviewId.id,
    },
    select: {
      subnetworkname: true,
    },
  });

  const polkadotEmissionsDataString = JSON.stringify(polkadotEmissionsData);
  const kusamaEmissionsDataString = JSON.stringify(kusamaEmissionsData);
  const polkadotSubnetworksString = JSON.stringify(polkadotSubnetworks);
  const kusamaSubnetworksString = JSON.stringify(kusamaSubnetworks);
  return {
    props: {
      paths,
      polkadotEmissionsDataString,
      kusamaEmissionsDataString,
      polkadotSubnetworksString,
      kusamaSubnetworksString,
    },
    revalidate: 10,
  };
}
type Props = {
  polkadotEmissionsDataString: string;
  kusamaEmissionsDataString: string;
  polkadotSubnetworksString: string;
  kusamaSubnetworksString: string;
};

const Networks: React.FC<Props> = (props) => {
  const [powerData, setPowerData] = useState<any>([]);
  const [emissionsData, setEmissionsData] = useState<any>([]);
  const [isDataSet, setIsDataSet] = useState(false);

  useEffect(() => {
    if (isDataSet === false) {
      formatPieChartData();
    }
  });

  const returnNetworkLinks = () => {
    return (
      <div>
        <Grid
          container
          direction='row'
          justifyContent={"center"}
          alignItems='flex-start'
          spacing={3}
        >
          <Grid item>
            <Grid
              container
              direction='column'
              justifyContent={"center"}
              alignItems='center'
              spacing={1}
            >
              <Grid item>
                <h3>POLKADOT</h3>
              </Grid>
              {polkadotSubnetworks.map((parachain: subnetworkName) => {
                const parachainHref =
                  "networks/" + parachain.subnetworkname.toUpperCase();
                return (
                  <Grid item key={parachain.subnetworkname}>
                    <Link href={parachainHref}>
                      <Button
                        variant='outlined'
                        color='inherit'
                        className={styles.geographicButton}
                      >
                        {parachain.subnetworkname}
                      </Button>
                    </Link>
                    <Divider />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              direction='column'
              justifyContent={"center"}
              alignItems='center'
              spacing={1}
            >
              <Grid item>
                <h3>KUSAMA</h3>
              </Grid>
              {kusamaSubnetworks.map((parachain: subnetworkName) => {
                const parachainHref =
                  "networks/" + parachain.subnetworkname.toUpperCase();
                return (
                  <Grid item key={parachain.subnetworkname}>
                    <Link href={parachainHref}>
                      <Button
                        variant='outlined'
                        color='inherit'
                        className={styles.geographicButton}
                      >
                        {parachain.subnetworkname}
                      </Button>
                    </Link>
                    <Divider />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  };

  const formatPieChartData = () => {
    let powerArray = [];
    let emissionsArray = [];
    let nodeArray = [];

    //loop through power, loop through emissions
    const networkData = [polkadotEmissionsData, kusamaEmissionsData];
    for (let i = 0; i < networkData.length; i++) {
      //Power and emissions for a 24 hour period
      let dayPower = 0;
      let dayEmissions = 0;
      //Network name
      const latestDataForNetwork = networkData[i][networkData[i].length - 1];
      let name = latestDataForNetwork.name;
      let nodes = latestDataForNetwork.numberofnodes;

      //Loop through last 4 records (4 x 6hrs = 24hrs)
      for (
        let j = networkData[i].length - 1;
        j > networkData[i].length - 5;
        j--
      ) {
        dayPower += networkData[i][j].totalpower;
        dayEmissions += networkData[i][j].totalemissions;
      }

      powerArray.push({
        name: name,
        value: dayPower,
        type: "power",
      });
      emissionsArray.push({
        name: name,
        value: dayEmissions,
        type: "emissions",
      });
      nodeArray.push({
        name: name,
        value: nodes,
        fill: lineColours[(i + 4) % 4],
      });
    }

    setPowerData(powerArray);
    setEmissionsData(emissionsArray);
    setIsDataSet(true);
  };

  const lineColours = ["#D6ECAC", "#C0FF00", "#779900", "#263300"];

  const polkadotEmissionsData = JSON.parse(props.polkadotEmissionsDataString);
  const kusamaEmissionsData = JSON.parse(props.kusamaEmissionsDataString);
  const polkadotSubnetworks = JSON.parse(props.polkadotSubnetworksString);
  const kusamaSubnetworks = JSON.parse(props.kusamaSubnetworksString);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Grid
          container
          direction='column'
          justifyContent={"center"}
          alignItems='center'
        >
          <Grid item>
            <h1>Network Overview</h1>
          </Grid>
          <Grid item>
            <Card className={styles.contentCard}>
              <Grid
                container
                direction='column'
                justifyContent={"center"}
                alignItems='center'
              >
                <Grid item>
                  <Card className={styles.valuesCard}>
                    <Grid
                      container
                      direction='column'
                      justifyContent={"center"}
                      alignItems='center'
                      spacing={2}
                    >
                      <Grid item>
                        <h3>Energy Consumption</h3>
                      </Grid>
                      <Grid item>
                        <NestedPieChart
                          powerData={powerData}
                          emissionsData={emissionsData}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item>
                  <Divider color='primary' />
                </Grid>
                {kusamaSubnetworks !== null || polkadotSubnetworks !== null}
                {
                  <Card
                    className={styles.valuesCard}
                    style={{ marginTop: "20px" }}
                  >
                    <Grid
                      container
                      direction='column'
                      justifyContent={"center"}
                      alignItems='center'
                    >
                      <Grid item>
                        <h3 style={{ paddingBottom: 20 }}>Subnetworks</h3>
                      </Grid>
                      <Grid item>{returnNetworkLinks()}</Grid>
                    </Grid>
                  </Card>
                }
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Networks;
