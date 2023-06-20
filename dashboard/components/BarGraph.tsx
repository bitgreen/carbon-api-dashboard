import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import styles from "../styles/Home.module.css";
import { BarGraphData, locations } from "../types";

type Props = {
  data: BarGraphData;
  reducedView: boolean;
};

//Bi-axial Bar graph displaying geographic emission and node data
const BarGraph: React.FC<Props> = (props) => {
  function formatBarData(barData: BarGraphData, reducedView: boolean) {
    let data = barData.locations;
    let average = {
      name: "Average",
      power: 0,
      nodes: 0,
      emissions: 0,
    };

    for (let i = 0; i < data.length; i++) {
      //Keep track of averages
      average.nodes += data[i].nodes;
      average.emissions += data[i].emissions;

      //Rename USA (too long on label)
      if (data[i].name === "United States of America") {
        data[i].name = "USA";
      }
    }
    //Workout average percentages
    average.nodes = parseInt((average.nodes / data.length).toFixed(0));
    average.emissions = parseInt((average.emissions / data.length).toFixed(1));

    //Find undefined countries index
    const index = data.findIndex((location) => location.name === "undefined");
    if (index > -1) {
      //Remove undefined countries bar
      data.splice(index, 1);
    }
    //Sort country data by number of nodes
    data = data.sort((a: locations, b: locations) => b.nodes - a.nodes);
    if (reducedView === true) {
      data = data.splice(0, 9);
    }
    //Place average at top of graph data.splice(0, 0, average);
    //Place average at bottom of graph
    data.push(average);

    return data;
  }

  const data = formatBarData(props.data, props.reducedView);

  function returnGraphLength() {
    if (props.reducedView === true) {
      return 10;
    } else {
      return props.data.locations.length;
    }
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
          <p className={styles.label}>{`${label}`}</p>
          <p className='desc'>Total nodes: {payload[0].value}</p>
          <p className='desc'>
            Emissions: {(payload[1].value / 1000).toLocaleString()} kgCO2e
          </p>
          <p className='desc' style={{ fontWeight: 800 }}>
            Node emissions:{" "}
            {(payload[1].value / payload[0].value / 1000).toFixed(4)} kgCO2e
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <ResponsiveContainer
        height={returnGraphLength() * 40 + 10}
        width='100%'
        className={styles.barContainer}
      >
        <BarChart
          data={data}
          margin={{ top: 0, right: 40, left: 40, bottom: 20 }}
          layout='vertical'
          barCategoryGap='20%'
          barGap={2}
          maxBarSize={10}
        >
          <CartesianGrid
            horizontal={false}
            stroke='#a0a0a0'
            strokeWidth={0.5}
          />
          <XAxis
            xAxisId={0}
            type='number'
            dataKey={"node"}
            orientation={"top"}
            axisLine={true}
            stroke='#D6ECAC'
            domain={[0, 2000]}
            strokeWidth={0.5}
            tick={true}
          >
            <Label
              className={styles.graphLabel}
              position='top'
              value='Node count'
              offset={0}
              width={120}
              height={100}
            />
          </XAxis>
          <XAxis
            xAxisId={1}
            type='number'
            dataKey={"emissions"}
            orientation={"bottom"}
            axisLine={true}
            stroke='#A6CC2E'
            strokeWidth={0.5}
            tick={true}
            tickFormatter={(value, index) => {
              return (value / 1000).toFixed(1);
            }}
          >
            <Label
              className={styles.graphLabel}
              position='bottom'
              value='kgCO2e'
              offset={0}
              width={120}
              height={100}
            />
          </XAxis>

          <YAxis
            yAxisId={0}
            type='category'
            dataKey={"name"}
            width={80}
            minTickGap={0}
            style={{ fontSize: "10pt" }}
          />
          {/*
            <YAxis
            yAxisId={1}
            orientation='right'
            type='category'
            dataKey={"emissions"}
            tickFormatter={(value, index) => {
              //Emissions per node
              const emissionsPerNode = (value / (data[index].nodes * 1000))
                .toFixed(4)
                .toLocaleString();

              return emissionsPerNode;
            }}
            width={80}
            minTickGap={0}
          >
            <Label
              className={styles.graphLabel}
              position='top'
              value='Node emissions (kgCO2e)'
              offset={10}
              width={120}
            />
          </YAxis>
            */}

          <Bar
            name='Nodes'
            xAxisId={0}
            dataKey='nodes'
            animationDuration={1000}
            fill='#D6ECAC'
          >
            {data.map((entry, index) => (
              <Cell
                fill={index === data.length - 1 ? "#8C92A1" : "#D6ECAC"}
                key={`cell-${index}`}
              />
            ))}
          </Bar>
          <Bar
            name='Emissions'
            xAxisId={1}
            dataKey='emissions'
            animationDuration={1000}
            fill='#A6CC2E
'
          >
            {data.map((entry, index) => (
              <Cell
                fill={index === data.length - 1 ? "#4F586E" : "#A6CC2E"}
                key={`cell-${index}`}
              />
            ))}
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
          <Legend verticalAlign='top' align='left' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraph;
