import React, { useState, useEffect, PureComponent } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  Label,
} from "recharts";
import { Card, Grid } from "@mui/material";
import TreemapGraph from "../../components/TreemapGraph";
import styles from "../../styles/Home.module.css";
import prisma from "../../lib/prisma";
import { treemap } from "../../types";
import Footer from "../../components/Footer";

export const getStaticProps: GetStaticProps = async () => {
  const latestOverviewId: any = await prisma.overviewdata.findFirst({
    orderBy: {
      timestamp: "desc",
    },
    select: {
      id: true,
    },
  });
  const overviewEmissions = await prisma.overviewdata.findMany({
    select: {
      timestamp: true,
      totalemissions: true,
      liveemissionfactor: true,
    },
  });
  const latestOverviewData = await prisma.overviewdata.findFirst({
    orderBy: {
      timestamp: "asc",
    },
  });
  const latestNetworkData = await prisma.networkdata.findMany({
    where: {
      overviewid: {
        equals: latestOverviewId.id,
      },
    },
    select: {
      totalemissions: true,
      name: true,
    },
    orderBy: {
      timestamp: "asc",
    },
  });
  const latestSubnetworkData = await prisma.subnetworkdata.findMany({
    where: {
      overviewid: {
        equals: latestOverviewId.id,
      },
    },
    select: {
      totalemissions: true,
      networkname: true,
      subnetworkname: true,
    },
    orderBy: {
      timestamp: "asc",
    },
  });
  const latestOverviewDataString = JSON.stringify(latestOverviewData);
  const overviewEmissionsString = JSON.stringify(overviewEmissions);
  const latestSubnetworkDataString = JSON.stringify(latestSubnetworkData);
  const latestNetworkDataString = JSON.stringify(latestNetworkData);
  return {
    props: {
      latestOverviewDataString,
      overviewEmissionsString,
      latestSubnetworkDataString,
      latestNetworkDataString,
    },
    revalidate: 10,
  };
};

type Props = {
  latestOverviewDataString: string;
  overviewEmissionsString: string;
  latestSubnetworkDataString: string;
  latestNetworkDataString: string;
};

const Emissions: React.FC<Props> = (props) => {
  const [parachainEmissionsData, setParachainEmissionsData] =
    useState<any>(null);
  const [treemapData, setTreemapData] = useState<any>(null);
  const [historicEmissions, setHistoricEmissions] = useState<number | null>(
    null
  );

  const overviewEmissions = JSON.parse(props.overviewEmissionsString);
  const latestSubnetworkData = JSON.parse(props.latestSubnetworkDataString);
  const latestNetworkData = JSON.parse(props.latestNetworkDataString);

  useEffect(() => {
    if (parachainEmissionsData === null) {
      //format data for barChart
      setParachainEmissionsData(latestNetworkData);
    }
    if (treemapData === null) {
      //format data for treemap
      let treemapArray = [];
      for (let i = 0; i < latestNetworkData.length; i++) {
        let subnetworks = [];
        for (let j = 0; j < latestSubnetworkData.length; j++) {
          if (
            latestSubnetworkData[j].networkname === latestNetworkData[i].name
          ) {
            subnetworks.push({
              name: latestSubnetworkData[j].subnetworkname,
              size: latestSubnetworkData[j].totalemissions,
            });
          }
        }
        treemapArray.push({
          name: latestNetworkData[i].name,
          children: subnetworks,
        });
      }
      setTreemapData(treemapArray);
    }
    if (historicEmissions === null) {
      let emissions = 0;
      for (let i = 0; i < overviewEmissions.length; i++) {
        emissions += overviewEmissions[i].totalemissions;
      }
      setHistoricEmissions(emissions);
    }
  });

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: any;
    payload: any;
    label: any;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.label}>{`${label}`}</p>
          <p className='desc'>
            Total emissions:{" "}
            {(payload[0].value / 1000).toFixed(1).toLocaleString()} kg CO2e
          </p>
        </div>
      );
    }

    return null;
  };

  const CustomTooltipGraph = ({
    active,
    payload,
    label,
  }: {
    active: any;
    payload: any;
    label: any;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.label}>{label}</p>
          <p>
            Average emission factor: {payload[0].value.toFixed(2)} gCO2e/kWh
          </p>
        </div>
      );
    }

    return null;
  };

  const lineColours = ["#D6ECAC", "#C0FF00", "#779900", "#263300"];
  const colors = ["#779900", "#C0FF00"];

  return (
    <div>
      <Head>
        <title>Carbon</title>
        <meta
          name='Carbon'
          content='View the carbon emissions of the Polkadot network'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Network Carbon Footprint</h1>
        <Card className={styles.contentCard}>
          {historicEmissions !== null && (
            <Card className={styles.valuesCard}>
              <Grid
                container
                direction='column'
                justifyContent='center'
                textAlign='center'
              >
                <Grid item>
                  <h3 style={{ paddingBottom: "10px" }}>
                    Carbon footprint - estimated running total{" "}
                  </h3>
                </Grid>
                <Grid item>
                  <h4 className={styles.unitText}>of the total network</h4>
                </Grid>
                <Grid item>
                  <h2>
                    {parseFloat(
                      (historicEmissions / 1000).toFixed(1)
                    ).toLocaleString()}{" "}
                    kg CO2e
                  </h2>
                </Grid>
                <Grid item>
                  <h4>
                    Since{" "}
                    {new Date(overviewEmissions[0].timestamp).toUTCString()}
                  </h4>
                </Grid>
              </Grid>
            </Card>
          )}
          {parachainEmissionsData !== null && (
            <Card className={styles.valuesCard}>
              <Grid
                container
                direction='column'
                justifyContent='flex-start'
                alignItems='flex-start'
              >
                <Grid item>
                  <h1 className={styles.sectionTitle}>
                    Cumulative Network Carbon Footprint
                  </h1>
                </Grid>
                <Grid item>
                  <h4 className={styles.descriptionBox}>
                    Overview of network's carbon footprint consumption
                  </h4>
                </Grid>
                <Grid item style={{ width: "100%" }}>
                  <ResponsiveContainer
                    width='100%'
                    height='100%'
                    minHeight='400px'
                  >
                    <BarChart
                      data={parachainEmissionsData}
                      style={{ display: "flex" }}
                    >
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='name' />
                      <YAxis
                        tickFormatter={(tick) => {
                          return `${(tick / 1000).toLocaleString()}`;
                        }}
                      />
                      <Legend />
                      <Bar
                        name='Carbon emissions'
                        dataKey='totalemissions'
                        fill='#C0FF00'
                      >
                        {parachainEmissionsData.map(
                          (entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % 2]}
                            />
                          )
                        )}
                      </Bar>
                      <Tooltip
                        content={
                          <CustomTooltip
                            active={undefined}
                            payload={undefined}
                            label={undefined}
                          />
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </Card>
          )}
          {treemapData !== null && (
            <div>
              <Card className={styles.valuesCard}>
                <Grid container direction='column' alignItems='flex-start'>
                  <Grid item>
                    <h1 className={styles.sectionTitle}>
                      Network Carbon Footprint
                    </h1>
                  </Grid>
                  <Grid item>
                    <h4 className={styles.descriptionBox}>
                      Breakdown by parachain and parent chains
                    </h4>
                  </Grid>
                  <Grid item style={{ width: "100%" }}>
                    <TreemapGraph treemapData={treemapData} type='carbon' />
                  </Grid>
                </Grid>
              </Card>
            </div>
          )}
          <Grid item>
            <Card className={styles.valuesCard}>
              <Grid container direction='column' alignItems='flex-start'>
                <Grid item>
                  <h1 className={styles.sectionTitle}>Live Emissions Factor</h1>
                </Grid>
                <Grid item>
                  <h4 className={styles.descriptionBox}>
                    Live emissions factor of the network
                  </h4>
                </Grid>
                <Grid item width={"100%"}>
                  <ResponsiveContainer
                    width='100%'
                    height='100%'
                    minHeight='400px'
                  >
                    <LineChart
                      width={500}
                      height={300}
                      data={overviewEmissions}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey={"timestamp"}
                        tickFormatter={(tick) => {
                          return `${new Date(tick).toUTCString()}`;
                        }}
                      />
                      <YAxis></YAxis>
                      <Tooltip
                        content={
                          <CustomTooltipGraph
                            active={undefined}
                            payload={undefined}
                            label={undefined}
                          />
                        }
                      />
                      <Legend verticalAlign='top' height={36} />
                      {["liveemissionfactor"].map((line, index) => {
                        return (
                          <Line
                            dot={false}
                            name='Emissions factor'
                            key={index}
                            type='monotone'
                            dataKey={line}
                            stroke={lineColours[index]}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Card>
        <Footer></Footer>
      </main>
    </div>
  );
};

export default Emissions;
