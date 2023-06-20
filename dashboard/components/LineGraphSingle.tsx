import React, { ReactNode } from "react";
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
import styles from "../styles/Home.module.css";

type Props = {
  data: any[];
  xKey: string;
  yKeys: string[];
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
        <p className={styles.label}>{new Date(label).toUTCString()}</p>
        <p className={styles.unitText}>
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

const lineColours = ["#D6ECAC", "#C0FF00", "#779900", "#263300"];

//Single line graph
const LineGraphSingle: React.FC<Props> = (props) => (
  <ResponsiveContainer width='100%' height='100%' minHeight='400px'>
    <LineChart
      width={500}
      height={300}
      data={props.data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <XAxis
        dataKey={props.xKey}
        tickFormatter={(tick) => {
          return `${new Date(tick).toUTCString()}`;
        }}
      />
      <YAxis
        tickFormatter={(tick) => {
          return `${tick.toLocaleString()}`;
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
      {props.yKeys.map((line, index) => {
        return (
          <Line
            dot={false}
            name='Nodes'
            key={index}
            type='monotone'
            dataKey={line}
            stroke={lineColours[index]}
          />
        );
      })}
    </LineChart>
  </ResponsiveContainer>
);

export default LineGraphSingle;
