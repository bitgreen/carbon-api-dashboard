import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import styles from "../styles/Home.module.css";

type Props = {
  powerData: any[];
  emissionsData: any[];
};

//2-level Pie chart with inner and outer ring
const NestedPieChart: React.FC<Props> = (props) => {
  const innerColours = ["#394055", "#4F586E", "#667085", "#8C92A1"];
  const outerColours = ["#C0FF00", "#779900", "#263300", "#D6ECAC"];

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
      switch (payload[0].payload.type) {
        case "emissions":
          return (
            <div className={styles.customTooltip}>
              <p className={styles.label}>{payload[0].name}</p>
              <p className='desc'>
                Emissions:{" "}
                {(payload[0].value / 1000).toFixed(1).toLocaleString()} kg CO2e
              </p>
            </div>
          );
        case "power":
          return (
            <div className={styles.customTooltip}>
              <p className={styles.label}>{payload[0].name}</p>
              <p className='desc'>
                Power: {(payload[0].value / 1000).toFixed(1).toLocaleString()}{" "}
                kWh
              </p>
            </div>
          );
      }
    }

    return null;
  };

  return (
    <PieChart width={250} height={250}>
      <Pie
        data={props.powerData}
        dataKey='value'
        nameKey='name'
        cx='50%'
        cy='50%'
        innerRadius={55}
        outerRadius={80}
        fill='#8884d8'
      >
        {props.powerData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={innerColours[index % innerColours.length]}
            stroke={""}
          />
        ))}
      </Pie>
      <Pie
        data={props.emissionsData}
        dataKey='value'
        nameKey='name'
        cx='50%'
        cy='50%'
        innerRadius={100}
        outerRadius={125}
        fill='#82ca9d'
      >
        {props.emissionsData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={outerColours[index % outerColours.length]}
            stroke={""}
          />
        ))}
      </Pie>
      <Tooltip
        content={
          <CustomTooltip
            active={undefined}
            payload={undefined}
            label={undefined}
          />
        }
      />
    </PieChart>
  );
};

export default NestedPieChart;
