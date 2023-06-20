import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { Card, Grid } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "../../styles/Home.module.css";
import prisma from "../../lib/prisma";
import LinearProgressWithLabel from "../../components/LinearProgressWithLabel";
import PercentAreaChart from "../../components/PercentAreaChart";
import Footer from "../../components/Footer";

export const getStaticProps: GetStaticProps = async () => {
  const overviewEmissions = await prisma.overviewdata.findMany({
    select: {
      timestamp: true,
      percentres: true,
      liveenergymix: true,
      totalpower: true,
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
      percentres: true,
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
      percentres: true,
    },
  });
  const overviewEmissionsString = JSON.stringify(overviewEmissions);
  const kusamaEmissionsDataString = JSON.stringify(kusamaEmissionsData);
  const polkadotEmissionsDataString = JSON.stringify(polkadotEmissionsData);
  return {
    props: {
      overviewEmissionsString,
      polkadotEmissionsDataString,
      kusamaEmissionsDataString,
    },
    revalidate: 10,
  };
};

type Props = {
  overviewEmissionsString: string;
  polkadotEmissionsDataString: string;
  kusamaEmissionsDataString: string;
};

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
        <p className={styles.label}>{label}</p>
        <p>
          Average zero carbon power utilization:{" "}
          {(payload[0].value * 100).toFixed(2)}%
        </p>
      </div>
    );
  }

  return null;
};

const Power: React.FC<Props> = (props) => {
  const overviewEmissions = JSON.parse(props.overviewEmissionsString);
  const polkadotEmissionsData = JSON.parse(props.polkadotEmissionsDataString);
  const kusamaEmissionsData = JSON.parse(props.kusamaEmissionsDataString);

  //Format network and overview data for line graph
  const formatPercentGraphData = () => {
    let data = [];
    for (let i = 0; i < overviewEmissions.length; i++) {
      data.push({
        timestamp: overviewEmissions[i].timestamp,
        overview: overviewEmissions[i].percentres,
        kusama: kusamaEmissionsData[i].percentres,
        polkadot: polkadotEmissionsData[i].percentres,
      });
    }
    return data;
  };

  const lineColours = ["#D6ECAC", "#C0FF00", "#779900", "#263300"];

  return (
    <div>
      <Head>
        <title>Energy Mix</title>
        <meta
          name='Renewables'
          content='View the renewables/fossil fuels usage of the Polkadot network'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Network Energy Mix</h1>
        <h4 className={styles.subDescription}>
          Overview of the zero carbon and fossil fuel energy sources used by the
          network
        </h4>
        <Card className={styles.contentCard}>
          <Grid container direction='column'>
            <Grid item width='100%'>
              <Grid container direction='row' spacing={6}>
                <Grid item xs={12} md={6} width='100%'>
                  <Grid container direction='column'>
                    <Grid item>
                      <h1 className={styles.sectionTitle}>
                        Zero Carbon vs Fossil Fuel Energy
                      </h1>
                      <h4 className={styles.descriptionBox}>
                        The estimated amount of zero carbon energy used by the
                        network, compared with fossil fuel energy
                      </h4>
                    </Grid>
                    <Grid item className={styles.unitGrid}>
                      <Card className={styles.valuesCard}>
                        <Grid
                          container
                          direction='column'
                          justifyContent='center'
                          textAlign='center'
                        >
                          <Grid item>
                            <LinearProgressWithLabel
                              value={
                                overviewEmissions[overviewEmissions.length - 1]
                                  .percentres
                              }
                              power={
                                overviewEmissions[overviewEmissions.length - 1]
                                  .totalpower
                              }
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6} width='100%'>
                  <Grid container direction='column'>
                    <Grid item width='100%'>
                      <h1 className={styles.sectionTitle}>
                        Zero Carbon Energy Utilization Rate
                      </h1>
                      <h4 className={styles.descriptionBox}>
                        The estimated amount of zero carbon energy used per
                        network
                      </h4>
                      <Card className={styles.valuesCard}>
                        <Grid container direction='column' alignItems='center'>
                          <Grid item width='100%'>
                            <PercentAreaChart data={formatPercentGraphData()} />
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <h1 className={styles.sectionTitle}>
                  Average Zero Carbon Power Utilization
                </h1>
                <h4 className={styles.descriptionBox}>
                  This graph show the average zero carbon power utilization by
                  network participants
                </h4>
                <Card className={styles.valuesCard}>
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
                      <YAxis
                        tickFormatter={(tick) => {
                          return `${tick * 100}%`;
                        }}
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
                      <Legend verticalAlign='top' height={36} />
                      {["liveenergymix"].map((line, index) => {
                        return (
                          <Line
                            dot={false}
                            name='Zero carbon power utilization'
                            key={index}
                            type='monotone'
                            dataKey={line}
                            stroke={lineColours[index]}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Card>
        <Footer></Footer>
      </main>
    </div>
  );
};

export default Power;
