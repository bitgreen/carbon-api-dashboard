import React, { useState, useEffect, PureComponent } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { Card, Grid, Button } from "@mui/material";
import prisma from "../../lib/prisma";
import styles from "../../styles/Home.module.css";
import LineGraphSingle from "../../components/LineGraphSingle";
import BarGraph from "../../components/BarGraph";
import TreemapGraph from "../../components/TreemapGraph";
import { nodeData } from "../../types";
import Footer from "../../components/Footer";

export const getStaticProps: GetStaticProps = async () => {
  const overviewNodes = await prisma.overviewdata.findMany({
    select: {
      timestamp: true,
      numberofnodes: true,
      totalemissions: true,
    },
  });
  const latestOverviewId: any = await prisma.overviewdata.findFirst({
    orderBy: {
      timestamp: "desc",
    },
    select: {
      id: true,
      locations: true,
    },
  });
  const latestNetworkNodes = await prisma.networkdata.findMany({
    where: {
      overviewid: {
        equals: latestOverviewId.id,
      },
    },
    select: {
      nodes: true,
      numberofnodes: true,
      name: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  const latestSubnetworkNodes = await prisma.subnetworkdata.findMany({
    where: {
      overviewid: {
        equals: latestOverviewId.id,
      },
    },
    select: {
      numberofnodes: true,
      networkname: true,
      subnetworkname: true,
    },
    orderBy: {
      timestamp: "asc",
    },
  });
  const overviewNodesString = JSON.stringify(overviewNodes);
  const latestOverviewString = JSON.stringify(latestOverviewId);
  const latestNetworkNodesString = JSON.stringify(latestNetworkNodes);
  const latestSubnetworkNodesString = JSON.stringify(latestSubnetworkNodes);
  return {
    props: {
      overviewNodesString,
      latestOverviewString,
      latestNetworkNodesString,
      latestSubnetworkNodesString,
    },
    revalidate: 10,
  };
};

type Props = {
  latestNetworkDataString: string;
  networkNodesString: string;
  overviewNodesString: string;
  latestOverviewString: string;
  latestNetworkNodesString: string;
  latestSubnetworkNodesString: string;
};

const Nodes: React.FC<Props> = (props) => {
  const [parachainNodeData, setParachainNodeData] = useState<any>(null);
  const [treemapData, setTreemapData] = useState<any>(null);

  const overviewNodes = JSON.parse(props.overviewNodesString);
  const latestOverviewNodes = JSON.parse(props.latestOverviewString);
  const latestNetworkNodes = JSON.parse(props.latestNetworkNodesString);
  const latestSubnetworkNodes = JSON.parse(props.latestSubnetworkNodesString);

  const yKeys = ["numberofnodes"];
  useEffect(() => {
    if (parachainNodeData === null) {
      //format data for barChart
      let parachainNodeArray = [];
      for (let i = 0; i < latestNetworkNodes.length; i++) {
        let obj = latestNetworkNodes[i].nodes;
        obj.name = latestNetworkNodes[i].name;

        parachainNodeArray.push(obj);
      }
      setParachainNodeData(parachainNodeArray);
    }
    if (treemapData === null) {
      //format data for treemap
      let treemapArray = [];
      for (let i = 0; i < latestNetworkNodes.length; i++) {
        let subnetworks = [];
        for (let j = 0; j < latestSubnetworkNodes.length; j++) {
          if (
            latestSubnetworkNodes[j].networkname === latestNetworkNodes[i].name
          ) {
            subnetworks.push({
              name: latestSubnetworkNodes[j].subnetworkname,
              size: latestSubnetworkNodes[j].numberofnodes,
            });
          }
        }
        treemapArray.push({
          name: latestNetworkNodes[i].name,
          children: subnetworks,
        });
      }
      setTreemapData(treemapArray);
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
            Validators: {payload[0].value.toLocaleString()}
          </p>
          <p className='desc'>Nodes: {payload[1].value.toLocaleString()}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Nodes</title>
        <meta
          name='Nodes'
          content='View the participants in the Polkadot ecosystem'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Network Node Activity</h1>
        <Card className={styles.contentCard}>
          <Grid
            container
            direction='column'
            justifyContent='flex-start'
            alignItems='flex-start'
          >
            <Grid item width='100%'>
              <Grid
                container
                direction='row'
                justifyContent='flex-start'
                alignItems='flex-start'
              >
                {overviewNodes !== null && (
                  <Grid item xs={12} md={6} width='100%'>
                    <Card className={styles.valuesCard}>
                      <Grid
                        container
                        direction='column'
                        justifyContent='flex-start'
                        alignItems='flex-start'
                      >
                        <Grid item>
                          <h1 className={styles.sectionTitle}>
                            Active Node History
                          </h1>
                        </Grid>

                        <Grid item width='100%'>
                          <LineGraphSingle
                            data={overviewNodes}
                            xKey={"timestamp"}
                            yKeys={yKeys}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                )}
                {parachainNodeData !== null && (
                  <Grid item xs={12} md={6} width='100%'>
                    <Card className={styles.valuesCard}>
                      <Grid
                        container
                        direction='column'
                        justifyContent='flex-start'
                        alignItems='flex-start'
                      >
                        <Grid item>
                          <h1 className={styles.sectionTitle}>
                            Active Node Type and Network
                          </h1>
                        </Grid>
                        <Grid item width='100%'>
                          <ResponsiveContainer width='100%' minHeight='400px'>
                            <BarChart data={parachainNodeData}>
                              <CartesianGrid strokeDasharray='3 3' />
                              <XAxis dataKey='name' />
                              <YAxis
                                tickFormatter={(tick) => {
                                  return `${tick.toLocaleString()}`;
                                }}
                              />
                              <Legend />
                              <Bar
                                name='Validators'
                                stackId='a'
                                dataKey='validators'
                                fill='#C0FF00'
                              />
                              <Bar
                                name='Nodes'
                                stackId='a'
                                dataKey='nodes'
                                fill='#779900'
                              />
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
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item width='100%' textAlign='center'>
              <Link href='https://wiki.polkadot.network/docs/maintain-sync'>
                <Button
                  variant='outlined'
                  color='inherit'
                  className={styles.geographicButton}
                >
                  Learn more about nodes here
                </Button>
              </Link>
            </Grid>
            {treemapData !== null && (
              <Grid item width='100%'>
                <Card className={styles.valuesCard}>
                  <Grid container direction='column' alignItems='flex-start'>
                    <Grid item>
                      <h1 className={styles.sectionTitle}>Network Breakdown</h1>
                    </Grid>
                    <Grid item>
                      <h4 className={styles.descriptionBox}>
                        Breakdown of energy consumption across parachains
                      </h4>
                    </Grid>
                    <Grid item style={{ width: "100%" }}>
                      <TreemapGraph treemapData={treemapData} type='nodes' />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            )}
            {
              <Grid item width='100%'>
                <Card className={styles.valuesCard}>
                  <Grid container direction='column' alignItems='flex-start'>
                    <Grid item>
                      <h1 className={styles.sectionTitle}>
                        Geographic Breakdown & Carbon Footprints
                      </h1>
                    </Grid>
                    <Grid item>
                      <h4 className={styles.descriptionBox}>
                        Where active validators are located, and their
                        associated carbon footprint
                      </h4>
                    </Grid>
                    <Grid item style={{ width: "100%" }}>
                      <BarGraph
                        data={latestOverviewNodes}
                        reducedView={false}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            }
          </Grid>
        </Card>
        <Footer></Footer>
      </main>
    </div>
  );
};

export default Nodes;
