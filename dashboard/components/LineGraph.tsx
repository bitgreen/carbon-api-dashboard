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
  Label,
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
          {payload[0].name}: {(payload[0].value / 1000).toFixed(1)} kg CO2e
        </p>
        <p className='desc'>
          {payload[1].name}: {(payload[1].value / 1000).toFixed(1)} kg CO2e
        </p>
        <p className='desc'>
          {payload[2].name}: {(payload[2].value / 1000).toFixed(1)} kg CO2e
        </p>
      </div>
    );
  }

  return null;
};

const lineColours = ["#D6ECAC", "#C0FF00", "#779900", "#263300"];

function capitalizeFirstLetter(string: string) {
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//Multi-line graph
const LineGraph: React.FC<Props> = (props) => (
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
          return `${(tick / 1000).toLocaleString()}`;
        }}
      >
        <Label
          className={styles.graphLabel}
          position='top'
          value='kgCO2e'
          offset={20}
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
      {props.yKeys.map((line, index) => {
        return (
          <Line
            dot={false}
            name={capitalizeFirstLetter(props.yKeys[index])}
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

export default LineGraph;
