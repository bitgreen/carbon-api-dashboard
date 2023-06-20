import React from "react";
import { Grid, Card, Chip, Stack, Box } from "@mui/material";
import styles from "../../styles/Home.module.css";
import BarGraph from "../../components/BarGraph";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import prisma from "../../lib/prisma";
import { subnetworkNodes, dAppData } from "../../types";
import Footer from "../../components/Footer";

export async function getStaticPaths() {
  // Return a list of possible value for id
  const parachainData = await prisma.parachains.findMany({
    select: {
      name: true,
    },
  });
  const paths = parachainData.map((parachain) => ({
    params: { name: parachain.name },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: any }) {
  // Fetch necessary data for the blog post using params.name
  const parachainData = await prisma.parachains.findUnique({
    where: {
      name: params.name,
    },
  });
  const latestSubnetworkData = await prisma.subnetworkdata.findFirst({
    where: {
      subnetworkname: params.name,
    },
    select: {
      numberofnodes: true,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  const subnetworkData = await prisma.subnetworkdata.findMany({
    where: {
      subnetworkname: params.name,
    },
    select: {
      timestamp: true,
      numberofnodes: true,
      totalemissions: true,
      totalpower: true,
    },
    orderBy: {
      timestamp: "asc",
    },
  });
  const latestSubnetworkDataString = JSON.stringify(latestSubnetworkData);
  const subnetworkDataString = JSON.stringify(subnetworkData);
  const dappData = await prisma.dapps.findMany({
    where: {
      parachain: params.name,
    },
    select: {
      name: true,
      totalnodes: true,
    },
  });
  const parachainDataString = JSON.stringify(parachainData);
  const dappDataString = JSON.stringify(dappData);
  return {
    props: {
      params,
      parachainDataString,
      latestSubnetworkDataString,
      subnetworkDataString,
      dappDataString,
    },
    revalidate: 10,
  };
}

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
        <p className='desc'>
          {payload[0].name}: {(payload[0].value / 1000).toFixed(1)} kW
        </p>
        <p className='desc'>
          {payload[1].name}: {(payload[1].value / 1000).toFixed(1)} kg CO2e
        </p>
      </div>
    );
  }

  return null;
};

const CustomNodeTooltip = ({
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
        <p className='desc'>
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

const CustomPieTooltip = ({
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
        <p className={styles.label}>{payload[0].name}</p>
        <p className='desc'>Nodes: {payload[0].value.toLocaleString()}</p>
      </div>
    );
  }

  return null;
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type Props = {
  parachainDataString: string;
  latestSubnetworkDataString: string;
  subnetworkDataString: string;
  dappDataString: string;
};

const NetworkPage: React.FC<Props> = (props) => {
  const parachainData = JSON.parse(props.parachainDataString);
  const latestSubetworkData = JSON.parse(props.latestSubnetworkDataString);
  const subnetworkData = JSON.parse(props.subnetworkDataString);
  const dappData = JSON.parse(props.dappDataString);
  const yKeys = ["power", "emissions"];
  const lineColours = ["#D6ECAC", "#C0FF00", "#779900", "#263300"];
  const innerColours = ["#394055", "#4F586E", "#667085", "#8C92A1"];
  const outerColours = ["#C0FF00", "#779900", "#263300", "#D6ECAC"];

  const formatLineGraphData = (data: subnetworkNodes[]) => {
    let lineGraphArray = [];

    for (let i = 0; i < data.length; i++) {
      const lineGraphData = {
        timestamp: new Date(data[i].timestamp).toUTCString(),
        power: data[i].totalpower,
        emissions: data[i].totalemissions,
      };
      lineGraphArray.push(lineGraphData);
    }
    return lineGraphArray;
  };

  const formatNodeData = (data: subnetworkNodes[]) => {
    let nodeGraphArray = [];

    for (let i = 0; i < data.length; i++) {
      const nodeGraphData = {
        timestamp: new Date(data[i].timestamp).toUTCString(),
        nodes: data[i].numberofnodes,
      };
      nodeGraphArray.push(nodeGraphData);
    }
    return nodeGraphArray;
  };

  //Format data for DApp pie chart
  const formatDappData = (dappData: dAppData[], numberofnodes: number) => {
    let totalDappNodes = 0;
    let pieChartData = [];
    for (let i = 0; i < dappData.length; i++) {
      totalDappNodes += dappData[i].totalnodes;
      pieChartData.push({
        name: dappData[i].name,
        nodes: dappData[i].totalnodes,
      });
    }
    if (totalDappNodes < numberofnodes) {
      pieChartData.push({
        name: "Unidentified",
        nodes: numberofnodes - totalDappNodes,
      });
    }
    return pieChartData;
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Card className={styles.contentCard}>
          <Grid
            container
            direction='column'
            justifyContent='center'
            alignItems='center'
          >
            <Grid item>
              <h1>{parachainData.name}</h1>
            </Grid>
            <Grid item>
              <Stack direction='row' spacing={1}>
                <Chip color='primary' label={parachainData.network} />
                {parachainData.servers.length === 0 && (
                  <Chip
                    color='primary'
                    label='No data supplied'
                    variant='outlined'
                    icon={<CancelIcon />}
                  />
                )}
                {parachainData.servers.length !== 0 && (
                  <Chip
                    color='primary'
                    label='Data supplied'
                    variant='outlined'
                    icon={<DoneIcon />}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
          <h1></h1>
          <Card className={styles.parachainCard}>
            <Grid
              container
              direction='row'
              justifyContent='flex-start'
              alignItems='flex-start'
            >
              <Grid item md={6} xs={12}>
                <Grid
                  container
                  direction='column'
                  justifyContent='flex-start'
                  alignItems='flex-start'
                >
                  <Grid item>
                    <h1 className={styles.sectionTitle}>Parachain nodes</h1>
                  </Grid>
                  <Grid item>
                    <h4 className={styles.descriptionBox}>
                      Nodes contributing to this parachain over time
                    </h4>
                  </Grid>

                  <Grid item width='100%'>
                    <ResponsiveContainer
                      width='100%'
                      height='100%'
                      minHeight='400px'
                    >
                      <LineChart
                        width={500}
                        height={300}
                        data={formatNodeData(subnetworkData)}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <XAxis
                          dataKey={"timestamp"}
                          tickFormatter={(tick) => {
                            return `${new Date(tick).toUTCString()}`;
                          }}
                        />
                        <YAxis
                          tickFormatter={(tick) => {
                            return `${tick.toLocaleString()}`;
                          }}
                        >
                          <Label
                            className={styles.graphLabel}
                            position='top'
                            value='Nodes'
                            offset={20}
                            width={120}
                          />
                        </YAxis>
                        <Tooltip
                          content={
                            <CustomNodeTooltip
                              active={undefined}
                              payload={undefined}
                              label={undefined}
                            />
                          }
                        />
                        <Legend verticalAlign='top' height={36} />
                        <Line
                          name={"Nodes"}
                          dot={false}
                          type='monotone'
                          dataKey={"nodes"}
                          stroke={lineColours[0]}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={6} xs={12}>
                <Grid
                  container
                  direction='column'
                  justifyContent='flex-start'
                  alignItems='flex-start'
                >
                  <Grid item>
                    <h1 className={styles.sectionTitle}>
                      Power/Emissions comparison
                    </h1>
                  </Grid>
                  <Grid item>
                    <h4 className={styles.descriptionBox}>
                      Comparison of the relative power usage and carbon
                      emissions across time for this parachain
                    </h4>
                  </Grid>

                  <Grid item width='100%'>
                    <ResponsiveContainer
                      width='100%'
                      height='100%'
                      minHeight='400px'
                    >
                      <LineChart
                        width={500}
                        height={300}
                        data={formatLineGraphData(subnetworkData)}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <XAxis
                          dataKey={"timestamp"}
                          tickFormatter={(tick) => {
                            return `${new Date(tick).toUTCString()}`;
                          }}
                        />
                        <YAxis
                          yAxisId='left'
                          tickFormatter={(tick) => {
                            return `${(tick / 1000).toLocaleString()}`;
                          }}
                        >
                          <Label
                            className={styles.graphLabel}
                            position='top'
                            value='kWh'
                            offset={20}
                            width={120}
                          />
                        </YAxis>
                        <YAxis
                          yAxisId='right'
                          orientation='right'
                          tickFormatter={(tick) => {
                            return `${(tick / 1000).toLocaleString()}`;
                          }}
                        >
                          <Label
                            className={styles.graphLabel}
                            position='top'
                            value='kgCO2e'
                            offset={20}
                            width={120}
                          />
                        </YAxis>
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
                        <Line
                          name={"Power"}
                          dot={false}
                          yAxisId='left'
                          type='monotone'
                          dataKey={"power"}
                          stroke={lineColours[0]}
                        />
                        <Line
                          name={"Emissions"}
                          dot={false}
                          yAxisId='right'
                          type='monotone'
                          dataKey={"emissions"}
                          stroke={lineColours[1]}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
          <Card className={styles.parachainCard}>
            <Grid
              container
              direction='column'
              justifyContent='flex-start'
              alignItems='flex-start'
            >
              <Grid item>
                <h1 className={styles.sectionTitle}>DApp breakdown</h1>
              </Grid>
              <Grid item>
                <h4 className={styles.descriptionBox}>
                  The DApps contributing to this parachain
                </h4>
              </Grid>
              <Grid item width='100%'>
                {latestSubetworkData !== null && dappData !== null && (
                  <ResponsiveContainer
                    width='100%'
                    height='100%'
                    minHeight='400px'
                  >
                    <PieChart width={250} height={250}>
                      <Pie
                        data={formatDappData(
                          dappData,
                          latestSubetworkData.numberofnodes
                        )}
                        dataKey='nodes'
                        nameKey='name'
                        cx='50%'
                        cy='50%'
                        innerRadius={100}
                        outerRadius={125}
                        fill='#82ca9d'
                      >
                        {formatDappData(
                          dappData,
                          latestSubetworkData.numberofnodes
                        ).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={outerColours[index % outerColours.length]}
                            stroke={""}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={
                          <CustomPieTooltip
                            active={undefined}
                            payload={undefined}
                            label={undefined}
                          />
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Grid>
            </Grid>
          </Card>
        </Card>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default NetworkPage;
