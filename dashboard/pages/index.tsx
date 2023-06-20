import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { Card, Divider, Grid, Box, Tab, Tabs, Button } from "@mui/material";
import Link from "next/link";
import dynamic from "next/dynamic";
import BarGraph from "../components/BarGraph";
import LineGraph from "../components/LineGraph";
import Footer from "../components/Footer";
import polkadot from "../assets/images/logos/polkadot.png";
import parity from "../assets/images/logos/parity.png";
import offsetra from "../assets/images/logos/offsetra.png";
import bitgreen from "../assets/images/logos/bitgreen.png";
import prisma from "../lib/prisma";
import styles from "../styles/Home.module.css";

export const getStaticProps: GetStaticProps = async () => {
  let latestOverviewData: any = await prisma.overviewdata.findFirst({
    orderBy: {
      id: "desc",
    },
    select: {
      totalpower: true,
      liveemissionfactor: true,
      id: true,
      locations: true,
    },
  });

  let overviewEmissionsData = await prisma.overviewdata.findMany({
    orderBy: {
      id: "asc",
    },
    select: {
      totalpower: true,
      totalemissions: true,
      timestamp: true,
    },
  });
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
  let subnetworkData = await prisma.subnetworkdata.findMany({
    where: {
      overviewid: {
        gt: latestOverviewData.id - 4,
      },
    },
    orderBy: {
      subnetworkid: "desc",
    },
    select: {
      overviewid: true,
      networkname: true,
      subnetworkname: true,
      totalpower: true,
      totalemissions: true,
      numberofnodes: true,
    },
  });
  const latestOverviewDataString = JSON.stringify(latestOverviewData);
  const overviewEmissionsDataString = JSON.stringify(overviewEmissionsData);
  const polkadotEmissionsDataString = JSON.stringify(polkadotEmissionsData);
  const kusamaEmissionsDataString = JSON.stringify(kusamaEmissionsData);
  const subnetworkDataString = JSON.stringify(subnetworkData);
  return {
    props: {
      latestOverviewDataString,
      overviewEmissionsDataString,
      polkadotEmissionsDataString,
      kusamaEmissionsDataString,
      subnetworkDataString,
    },
    revalidate: 10,
  };
};

type Props = {
  latestOverviewDataString: string;
  overviewEmissionsDataString: string;
  polkadotEmissionsDataString: string;
  kusamaEmissionsDataString: string;
  subnetworkDataString: string;
};

//Landing page for the dashboard
const Dashboard: React.FC<Props> = (props) => {
  const latestOverviewData = JSON.parse(props.latestOverviewDataString);
  const overviewEmissionsData = JSON.parse(props.overviewEmissionsDataString);
  const polkadotEmissionsData = JSON.parse(props.polkadotEmissionsDataString);
  const kusamaEmissionsData = JSON.parse(props.kusamaEmissionsDataString);
  const subnetworkData = JSON.parse(props.subnetworkDataString);

  //Find overview data for past 24 hours
  const findInitialPerformance = () => {
    let dayPower = 0;
    let dayEmissions = 0;

    for (
      let i = overviewEmissionsData.length - 1;
      i > overviewEmissionsData.length - 5;
      i--
    ) {
      dayPower += overviewEmissionsData[i]?.totalpower || 0;
      dayEmissions += overviewEmissionsData[i]?.totalemissions || 0;
    }

    return [dayPower, dayEmissions];
  };
  const initalResults = findInitialPerformance();

  const [tabValue, setTabValue] = useState(0);
  const [networkPower, setNetworkPower] = useState(initalResults[0]);
  const [networkEmissions, setNetworkEmissions] = useState(initalResults[1]);
  const [pieDisplay, setPieDisplay] = useState("overview");
  const [pieSelectedNetwork, setPieSelectedNetwork] = useState("");
  const [powerData, setPowerData] = useState<any>([]);
  const [emissionsData, setEmissionsData] = useState<any>([]);
  const [isDataSet, setIsDataSet] = useState(false);
  const [nodeData, setNodeData] = useState<any>([]);
  const [historicEmissions, setHistoricEmissions] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (isDataSet === false) {
      switch (pieDisplay) {
        case "network":
          formatNetworkData(pieSelectedNetwork);
          break;
        case "overview":
          formatOverviewData();
          break;
        default:
          setIsDataSet(true);
      }
    }
    if (historicEmissions === null) {
      let emissions = 0;
      for (let i = 0; i < overviewEmissionsData.length; i++) {
        emissions += overviewEmissionsData[i].totalemissions;
      }
      setHistoricEmissions(emissions);
    }
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    //Power and emissions for a 24 hour period
    let dayPower = 0;
    let dayEmissions = 0;

    switch (newValue) {
      case 0:
        //OVERALL
        dayPower = 0;
        dayEmissions = 0;

        for (
          let i = overviewEmissionsData.length - 1;
          i > overviewEmissionsData.length - 5;
          i--
        ) {
          dayPower += overviewEmissionsData[i]?.totalpower || 0;
          dayEmissions += overviewEmissionsData[i]?.totalemissions || 0;
        }
        setNetworkPower(dayPower);
        setNetworkEmissions(dayEmissions);
        setPieDisplay("overview");
        setIsDataSet(false);
        break;

      case 1:
        //POLKADOT

        dayPower = 0;
        dayEmissions = 0;

        for (
          let i = polkadotEmissionsData.length - 1;
          i > polkadotEmissionsData.length - 5;
          i--
        ) {
          dayPower += polkadotEmissionsData[i]?.totalpower || 0;
          dayEmissions += polkadotEmissionsData[i]?.totalemissions || 0;
        }

        setNetworkPower(dayPower);
        setNetworkEmissions(dayEmissions);
        setPieDisplay("network");
        setPieSelectedNetwork(polkadotEmissionsData[0].name);
        setIsDataSet(false);
        break;

      case 2:
        //KUSAMA

        dayPower = 0;
        dayEmissions = 0;

        for (
          let i = kusamaEmissionsData.length - 1;
          i > kusamaEmissionsData.length - 5;
          i--
        ) {
          dayPower += kusamaEmissionsData[i]?.totalpower || 0;
          dayEmissions += kusamaEmissionsData[i]?.totalemissions || 0;
        }

        setNetworkPower(dayPower);
        setNetworkEmissions(dayEmissions);
        setPieDisplay("network");
        setPieSelectedNetwork(kusamaEmissionsData[0].name);
        setIsDataSet(false);
        break;
    }
  };

  const formatOverviewData = () => {
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
        dayPower += networkData[i][j]?.totalpower || 0;
        dayEmissions += networkData[i][j]?.totalemissions || 0;
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
    setNodeData(nodeArray);
    setIsDataSet(true);
  };

  const formatNetworkData = (selectedNetwork: string) => {
    let powerArray = [];
    let emissionsArray = [];
    let nodeArray = [];

    //Find most recent overview id
    const latestOverviewIndex = latestOverviewData.id;

    //Loop through subnetwork data
    for (let i = 0; i < subnetworkData.length; i++) {
      //If data is from the past 24 hours and is from correct network
      if (
        subnetworkData[i].overviewid > latestOverviewIndex - 4 &&
        subnetworkData[i].networkname === selectedNetwork
      ) {
        //Look for index of subnetwork
        const index = powerArray.findIndex(
          (subnetwork) => subnetwork.name === subnetworkData[i].subnetworkname
        );
        //If subnetwork has not been found
        if (index === -1) {
          powerArray.push({
            name: subnetworkData[i].subnetworkname,
            value: subnetworkData[i].totalpower,
            type: "power",
          });
          emissionsArray.push({
            name: subnetworkData[i].subnetworkname,
            value: subnetworkData[i].totalemissions,
            type: "emissions",
          });
          nodeArray.push({
            name: subnetworkData[i].subnetworkname,
            value: subnetworkData[i].numberofnodes,
            fill: lineColours[(i + 4) % 4],
          });
        } else {
          //If subnetwork has been found previously
          powerArray[index].value += subnetworkData[i].totalpower;
          emissionsArray[index].value += subnetworkData[i].totalemissions;
        }
      }
    }

    setPowerData(powerArray);
    setEmissionsData(emissionsArray);
    setNodeData(nodeArray);
    setIsDataSet(true);
  };

  function fetchYKeys() {
    return ["Overview", "Kusama", "Polkadot"];
  }

  function formatGraphData() {
    let data = [];

    for (let i = 0; i < overviewEmissionsData.length; i++) {
      data.push({
        Timestamp: overviewEmissionsData[i].timestamp,
        Overview: overviewEmissionsData[i].totalemissions,
        Kusama: kusamaEmissionsData[i].totalemissions,
        Polkadot: polkadotEmissionsData[i].totalemissions,
      });
    }
    return data;
  }

  function a11yProps(index: number) {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  }

  const PieChart = dynamic(() => import("../components/NestedPieChart"), {
    ssr: false,
  });

  const lineColours = ["#D6ECAC", "#C0FF00", "#779900", "#263300"];

  let recordingPeriod = 6; //hours

  return (
    <div className={styles.container}>
      <Head>
        <title>Green Polkadot Dashboard</title>
        <meta
          name='Dashboard'
          content='An overview of the Polkadot ecosystem'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Card className={styles.contentCard}>
          {historicEmissions !== null && (
            <Grid
              container
              direction='column'
              justifyContent='center'
              alignItems='center'
              width='100%'
              style={{ paddingBottom: "40px" }}
            >
              <Grid item>
                <h1 className={styles.sectionTitle}>
                  Cumulative Carbon Emissions
                </h1>
              </Grid>
              <Grid item>
                <h4 className={styles.descriptionTop}>
                  Since{" "}
                  {new Date(overviewEmissionsData[0].timestamp).toUTCString()}
                </h4>
              </Grid>
              <Grid item>
                <h2 className={styles.metricData}>
                  {parseFloat(
                    (historicEmissions / 1000).toFixed(1)
                  ).toLocaleString()}{" "}
                </h2>
              </Grid>
              <Grid item>
                <h4 className={styles.unitText}>kg CO2e</h4>
              </Grid>
            </Grid>
          )}

          <Grid
            container
            direction='column'
            justifyContent='flex-start'
            alignItems='flex-start'
            width='100%'
          >
            <Grid item xs={12} md={12} width='100%'>
              <Grid
                container
                direction='row'
                justifyContent='flex-start'
                alignItems='flex-start'
              >
                <Grid item xs={12} md={6}>
                  <Grid
                    container
                    direction='column'
                    justifyContent='flex-start'
                    alignItems='flex-start'
                  >
                    <Grid item>
                      <h1 className={styles.sectionTitle}>Overview</h1>
                    </Grid>

                    <Grid item>
                      <h4 className={styles.descriptionBox}>
                        Live estimated energy consumption and carbon data
                      </h4>
                    </Grid>
                    <Grid item className={styles.metricBox}>
                      <Card className={styles.valuesCard}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "fit-content",
                            margin: "auto",
                            borderRadius: 1,
                            "& svg": {
                              m: 1.5,
                            },
                            "& hr": {
                              mx: 0.5,
                            },
                          }}
                        >
                          <Grid
                            container
                            direction='column'
                            justifyContent='center'
                            alignItems='center'
                            textAlign='center'
                            className={styles.metricGridRight}
                          >
                            <Grid item className={styles.energyConsumption}>
                              <h4 className={styles.metricTitle}>Energy</h4>
                              <h4 className={styles.metricTitle}>
                                Consumption
                              </h4>
                              <h2 className={styles.metricData}>
                                {(
                                  latestOverviewData.totalpower /
                                  (recordingPeriod * 1000)
                                ).toFixed(1)}
                              </h2>
                              <h4 className={styles.unitText}>kWh</h4>
                            </Grid>
                          </Grid>
                          <Divider
                            color='primary'
                            orientation='vertical'
                            flexItem
                            className={styles.metricDivider}
                          />
                          <Grid
                            container
                            direction='column'
                            justifyContent='center'
                            alignItems='center'
                            textAlign='center'
                            className={styles.metricGridLeft}
                          >
                            <Grid item className={styles.carbonEmissions}>
                              <h4 className={styles.metricTitle}>Emissions</h4>
                              <h4 className={styles.metricTitle}>factor</h4>
                              <h2 className={styles.metricData}>
                                {latestOverviewData.liveemissionfactor.toFixed(
                                  3
                                )}
                              </h2>
                              <h4 className={styles.unitText}>gCO2e/kWh</h4>
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid
                    container
                    direction='column'
                    justifyContent='flex-start'
                    alignItems='flex-start'
                  >
                    <Grid item style={{ marginBottom: "30px" }}>
                      <h1 className={styles.sectionTitle}>
                        24 Hour Performance Overview
                      </h1>
                      <h4 className={styles.descriptionBox}>
                        Live daily estimated energy consumption and carbon
                        emissions
                      </h4>
                    </Grid>
                    <Grid item width='100%'>
                      <Card className={styles.valuesCard}>
                        <Grid
                          container
                          direction='row'
                          justifyContent='flex-start'
                          spacing={6}
                        >
                          <Grid item>
                            <PieChart
                              powerData={powerData}
                              emissionsData={emissionsData}
                            />
                          </Grid>
                          <Grid item style={{ margin: "auto" }}>
                            <Grid
                              container
                              direction='column'
                              textAlign='center'
                            >
                              <Grid item>
                                <h2 className={styles.metricData}>
                                  {parseFloat(
                                    (networkEmissions / 1000).toFixed(1)
                                  ).toLocaleString()}
                                </h2>
                                <h4 className={styles.unitText}>kg CO2e</h4>
                              </Grid>
                              <Divider />
                              <Grid item>
                                <h2 className={styles.metricData}>
                                  {parseFloat(
                                    (networkPower / 1000).toFixed(1)
                                  ).toLocaleString()}
                                </h2>
                                <h4 className={styles.unitText}>kWh</h4>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item style={{ margin: "auto" }}>
                            <Box
                              sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                              <Tabs
                                orientation='vertical'
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label='basic tabs example'
                                TabIndicatorProps={{
                                  style: {
                                    backgroundColor: "#C0FF00",
                                  },
                                }}
                                textColor='inherit'
                              >
                                <Tab
                                  label='OVERVIEW'
                                  {...a11yProps(0)}
                                  className={styles.tabButton}
                                />
                                <Tab
                                  label='POLKADOT'
                                  {...a11yProps(1)}
                                  className={styles.tabButton}
                                />
                                <Tab
                                  label='KUSAMA'
                                  {...a11yProps(2)}
                                  className={styles.tabButton}
                                />
                              </Tabs>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item width='100%' style={{ marginTop: "100px" }}>
              <Grid
                container
                direction='row'
                justifyContent='flex-start'
                alignItems='flex-start'
              >
                <Grid item xs={12} md={6}>
                  <Grid
                    container
                    direction='column'
                    justifyContent='flex-start'
                    alignItems='flex-start'
                  >
                    <Grid item>
                      <h1 className={styles.sectionTitle}>Carbon Footprint</h1>
                      <h4 className={styles.descriptionBox}>
                        (6 hourly intervals)
                      </h4>
                    </Grid>
                    <Grid item width='100%'>
                      <Card className={styles.valuesCard}>
                        <LineGraph
                          data={formatGraphData()}
                          xKey='Timestamp'
                          yKeys={fetchYKeys()}
                        />
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid
                    container
                    direction='column'
                    justifyContent='flex-start'
                    alignItems='flex-start'
                  >
                    <Grid item>
                      <h1 className={styles.sectionTitle}>
                        Geographic Breakdown
                      </h1>
                      <h4 className={styles.descriptionBox}>
                        Current active validator and node locations and carbon
                        footprint
                      </h4>
                    </Grid>
                    <Grid item width='100%'>
                      <Card className={styles.valuesCard}>
                        <Grid
                          container
                          direction='column'
                          justifyContent='center'
                          alignItems='center'
                          spacing={2}
                        >
                          <Grid item width='100%'>
                            <BarGraph
                              data={latestOverviewData}
                              reducedView={true}
                            />
                          </Grid>
                          <Grid item>
                            <Grid item>
                              <Link href='/data/nodes'>
                                <Button
                                  variant='outlined'
                                  color='inherit'
                                  className={styles.geographicButton}
                                >
                                  See all geographic data
                                </Button>
                              </Link>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <h1>Further Info</h1>
              <Card className={styles.valuesCard}>
                <Grid
                  container
                  direction='column'
                  textAlign='center'
                  alignItems='center'
                >
                  <Grid item>
                    <div className={styles.grid}>
                      <Link href='/data/nodes'>
                        <a className={styles.card}>
                          <h2>Nodes</h2>
                          <p>
                            Find the node information for the relay chain and
                            various parachains
                          </p>
                        </a>
                      </Link>

                      <Link href='/data/power'>
                        <a className={styles.card}>
                          <h2>Power Consumption</h2>
                          <p>
                            Learn about the power consumption of the network
                          </p>
                        </a>
                      </Link>

                      <Link href='/data/carbon'>
                        <a className={styles.card}>
                          <h2>Carbon Footprint</h2>
                          <p>
                            Explore the associated carbon footprint of Polkadot
                          </p>
                        </a>
                      </Link>

                      <Link href='/data/renewables'>
                        <a className={styles.card}>
                          <h2>Energy Mix</h2>
                          <p>
                            Compare the renewables vs. Fossil fuel energy supply
                            split
                          </p>
                        </a>
                      </Link>

                      <Link href='/networks'>
                        <a className={styles.card}>
                          <h2>Networks</h2>
                          <p>Compare parachains within the Dotsama Ecosystem</p>
                        </a>
                      </Link>
                      <Link href='/info'>
                        <a className={styles.card}>
                          <h2>Guide</h2>
                          <p>
                            Review the methodology used to calculate network
                            power and emissions
                          </p>
                        </a>
                      </Link>
                    </div>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Dashboard;
