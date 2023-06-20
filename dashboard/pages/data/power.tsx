import React, { useState, useEffect, PureComponent } from "react";
import { GetStaticProps } from "next";
import prisma from "../../lib/prisma";
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
  Cell,
  Label,
} from "recharts";
import { Card, Grid } from "@mui/material";
import TreemapGraph from "../../components/TreemapGraph";
import styles from "../../styles/Home.module.css";
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
  const overviewPower = await prisma.overviewdata.findMany({
    select: {
      timestamp: true,
      totalpower: true,
    },
  });
  const latestNetworkData = await prisma.networkdata.findMany({
    where: {
      overviewid: {
        equals: latestOverviewId.id,
      },
    },
    select: {
      totalpower: true,
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
      totalpower: true,
      networkname: true,
      subnetworkname: true,
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  const overviewPowerString = JSON.stringify(overviewPower);
  const latestSubnetworkDataString = JSON.stringify(latestSubnetworkData);
  const latestNetworkDataString = JSON.stringify(latestNetworkData);
  return {
    props: {
      overviewPowerString,
      latestSubnetworkDataString,
      latestNetworkDataString,
    },
    revalidate: 10,
  };
};

type Props = {
  overviewPowerString: string;
  latestSubnetworkDataString: string;
  latestNetworkDataString: string;
};

const Power: React.FC<Props> = (props) => {
  const [parachainPowerData, setParachainPowerData] = useState<any>(null);
  const [treemapData, setTreemapData] = useState<any>(null);
  const [historicPower, setHistoricPower] = useState<number | null>(null);

  const overviewPower = JSON.parse(props.overviewPowerString);
  const latestSubnetworkData = JSON.parse(props.latestSubnetworkDataString);
  const latestNetworkData = JSON.parse(props.latestNetworkDataString);

  useEffect(() => {
    if (parachainPowerData === null) {
      //format data for barChart
      /*
      let parachainNodeArray = [];
      for (let i = 0; i < latestOverviewData.parachainnodes.length; i++) {
        parachainNodeArray.push({
          name: latestOverviewData.parachainnodes[i].name,
          power: latestOverviewData.parachainnodes[i].power,
        });
      }
      */
      setParachainPowerData(latestNetworkData);
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
              size: latestSubnetworkData[j].totalpower,
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

    if (historicPower === null) {
      let power = 0;
      for (let i = 0; i < overviewPower.length; i++) {
        power += overviewPower[i].totalpower;
      }
      setHistoricPower(power);
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
            Total power: {(payload[0].value / 1000).toFixed(1).toLocaleString()}{" "}
            kWh
          </p>
        </div>
      );
    }

    return null;
  };

  const colors = ["#779900", "#C0FF00"];

  return (
    <div>
      <Head>
        <title>Power</title>
        <meta
          name='Power'
          content='View the power usage of the Polkadot network'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Network Energy Consumption</h1>
        <Card className={styles.contentCard}>
          {historicPower !== null && (
            <Card className={styles.valuesCard}>
              <Grid
                container
                direction='column'
                justifyContent='center'
                textAlign='center'
              >
                <Grid item>
                  <h3 style={{ paddingBottom: "10px" }}>
                    Energy consumption - estimated running total
                  </h3>
                </Grid>
                <Grid item>
                  <h4 className={styles.unitText}>of the total network</h4>
                </Grid>
                <Grid item>
                  <h2>
                    {parseFloat(
                      (historicPower / 1000).toFixed(1)
                    ).toLocaleString()}{" "}
                    kWh
                  </h2>
                </Grid>
                <Grid item>
                  <h4>
                    Since {new Date(overviewPower[0].timestamp).toUTCString()}
                  </h4>
                </Grid>
              </Grid>
            </Card>
          )}
          {parachainPowerData !== null && (
            <div>
              <Card className={styles.valuesCard}>
                <Grid
                  container
                  direction='column'
                  justifyContent='flex-start'
                  alignItems='flex-start'
                >
                  <Grid item>
                    <h1 className={styles.sectionTitle}>
                      Total Network Power Consumption
                    </h1>
                  </Grid>
                  <Grid item>
                    <h4 className={styles.descriptionBox}>
                      Energy consumption of networks, derived from active nodes,
                      validators and the known hardware utilization
                    </h4>
                  </Grid>
                  <Grid item style={{ minWidth: "100%" }}>
                    <ResponsiveContainer
                      width='100%'
                      height='100%'
                      minHeight='400px'
                    >
                      <BarChart data={parachainPowerData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis
                          tickFormatter={(tick) => {
                            return `${tick.toLocaleString()}`;
                          }}
                        >
                          <Label
                            className={styles.graphLabel}
                            position='left'
                            value='(kgCO2e/kWh)'
                            offset={10}
                            width={120}
                          />
                        </YAxis>
                        <Legend />
                        <Bar name='Power' dataKey='totalpower' fill='#C0FF00'>
                          {parachainPowerData.map(
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
            </div>
          )}
          {treemapData !== null && (
            <div>
              <Grid item>
                <h1 className={styles.sectionTitle}>Network Breakdown</h1>
              </Grid>
              <Grid item>
                <h4 className={styles.descriptionBox}>
                  Breakdown of power consumption from the network including
                  network and subnetworks
                </h4>
              </Grid>
              <Card className={styles.valuesCard}>
                <Grid container direction='column' alignItems='center'>
                  <Grid item style={{ width: "100%" }}>
                    <TreemapGraph treemapData={treemapData} type='power' />
                  </Grid>
                </Grid>
              </Card>
            </div>
          )}
        </Card>
        <Footer></Footer>
      </main>
    </div>
  );
};

export default Power;
