import React, { ReactNode } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "../styles/Home.module.css";

type Props = {
  data: any[];
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
        <p className={styles.label}>{payload[0].payload.timestamp}</p>
        <p className='desc'>
          {payload[0].name}: {payload[0].value.toFixed(2)}%
        </p>
        <p className='desc'>
          {payload[1].name}: {payload[1].value.toFixed(2)}%
        </p>
        <p className='desc'>
          {payload[2].name}: {payload[2].value.toFixed(2)}%
        </p>
      </div>
    );
  }

  return null;
};

//Multi-line percentage graph
const PercentAreaChart: React.FC<Props> = (props) => (
  <ResponsiveContainer width='100%' height='100%' minHeight='300px'>
    <LineChart width={600} height={600} data={props.data}>
      <XAxis
        dataKey='timestamp'
        tickFormatter={(tick) => {
          return `${new Date(tick).toUTCString()}`;
        }}
      />
      <YAxis
        tickFormatter={(tick) => {
          return `${tick}%`;
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
      <Line
        dot={false}
        name='Total'
        type='monotone'
        dataKey='overview'
        stroke='#D6ECAC'
        fill='#D6ECAC'
      />
      <Line
        dot={false}
        name='Polkadot'
        type='monotone'
        dataKey='polkadot'
        stroke='#C0FF00'
        fill='#C0FF00'
      />
      <Line
        dot={false}
        name='Kusama'
        type='monotone'
        dataKey='kusama'
        stroke='#779900'
        fill='#779900'
      />
      <Legend />
    </LineChart>
  </ResponsiveContainer>
);

export default PercentAreaChart;
