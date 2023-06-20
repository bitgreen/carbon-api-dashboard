import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import styles from "../styles/Home.module.css";

type Props = {
  data: any[];
  dataKey: string;
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
        <p className={styles.label}>NODES</p>
        <p>
          {payload[0].payload.name}: {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

const style = {
  top: 0,
  left: 0,
  lineHeight: "24px",
};

//Radial bar chart component
const RadarGraph: React.FC<Props> = (props) => (
  <ResponsiveContainer width='100%' height='100%' minHeight='270px'>
    <RadialBarChart
      cx='50%'
      cy='50%'
      innerRadius='30%'
      outerRadius='80%'
      barSize={15}
      data={props.data}
    >
      <RadialBar background={{ fill: "#222" }} dataKey='value' />
      <Tooltip
        content={
          <CustomTooltip
            active={undefined}
            payload={undefined}
            label={undefined}
          />
        }
      />
      <Legend iconSize={10} layout='horizontal' verticalAlign='bottom' />
    </RadialBarChart>
  </ResponsiveContainer>
);

export default RadarGraph;
