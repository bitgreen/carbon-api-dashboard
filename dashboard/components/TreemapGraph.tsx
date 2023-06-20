import React, { useState, useEffect, PureComponent } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Treemap,
  ResponsiveContainer,
} from "recharts";
import styles from "../styles/Home.module.css";

type Props = {
  treemapData: any;
  type: string;
};

//Treemap component displaying breakdown of networks and parachains
const TreemapGraph: React.FC<Props> = (props) => {
  const COLORS = [
    "#779900",
    "#263300",
    "#D6ECAC",
    "#C0FF00",
    "#8889DD",
    "#9597E4",
    "#8DC77B",
    "#A5D297",
    "#E2CF45",
    "#F8C12D",
  ];

  const CustomizedContent = ({
    root,
    depth,
    x,
    y,
    width,
    height,
    index,
    colors,
    name,
  }: {
    root: any;
    depth: number;
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
    colors: any;
    name: string;
  }) => {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill:
              depth < 2
                ? colors[Math.floor((index / root.children.length) * 6)]
                : "rgba(0,0,0,0.1)",
            stroke: "#fff",
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {depth === 1 ? (
          <text
            x={x + width / 2}
            y={y + height / 2 + 7}
            textAnchor='middle'
            fill='#fff'
            fontSize={14}
          >
            {name}
          </text>
        ) : null}
        {depth === 1 ? (
          <text
            x={x + 4}
            y={y + 18}
            fill='#fff'
            fontSize={16}
            fillOpacity={0.9}
          >
            {index + 1}
          </text>
        ) : null}
      </g>
    );
  };

  /*
  class CustomizedContent extends PureComponent {
    render() {
      const {
        root,
        depth,
        x,
        y,
        width,
        height,
        index,
        colors,
        name,
      } = this.props;

      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill:
                depth < 2
                  ? colors[Math.floor((index / root.children.length) * 6)]
                  : "rgba(0,0,0,0.1)",
              stroke: "#fff",
              strokeWidth: 2 / (depth + 1e-10),
              strokeOpacity: 1 / (depth + 1e-10),
            }}
          />
          {depth === 1 ? (
            <text
              x={x + width / 2}
              y={y + height / 2 + 7}
              textAnchor='middle'
              fill='#fff'
              fontSize={14}
            >
              {name}
            </text>
          ) : null}
          {depth === 1 ? (
            <text
              x={x + 4}
              y={y + 18}
              fill='#fff'
              fontSize={16}
              fillOpacity={0.9}
            >
              {index + 1}
            </text>
          ) : null}
        </g>
      );
    }
  }
*/
  const CustomTooltip = ({
    active,
    payload,
    type,
  }: {
    active: any;
    payload: any;
    label: any;
    type: string;
  }) => {
    if (active && payload && payload.length) {
      switch (type) {
        case "nodes":
          return (
            <div className={styles.customTooltip}>
              <p className={styles.label}>{`${payload[0].payload.name}`}</p>
              <p className='desc'>Total nodes: {payload[0].value}</p>
            </div>
          );
        case "power":
          return (
            <div className={styles.customTooltip}>
              <p className={styles.label}>{`${payload[0].payload.name}`}</p>
              <p className='desc'>
                Total power: {(payload[0].value / 1000).toFixed(1)} kWh
              </p>
            </div>
          );
        case "carbon":
          return (
            <div className={styles.customTooltip}>
              <p className={styles.label}>{`${payload[0].payload.name}`}</p>
              <p className='desc'>
                Total emissions: {(payload[0].value / 1000).toFixed(1)} kgCO2e
              </p>
            </div>
          );
        default:
          break;
      }
    }

    return null;
  };

  return (
    <ResponsiveContainer width='100%' height='100%' minHeight='400px'>
      <Treemap
        data={props.treemapData}
        dataKey='size'
        //ratio={4 / 3}
        stroke='#fff'
        fill='#8884d8'
        content={
          <CustomizedContent
            colors={COLORS}
            root={undefined}
            depth={0}
            x={0}
            y={0}
            width={0}
            height={0}
            index={0}
            name={""}
          />
        }
      >
        <Tooltip
          content={
            <CustomTooltip
              type={props.type}
              active={undefined}
              payload={undefined}
              label={undefined}
            />
          }
        />
      </Treemap>
    </ResponsiveContainer>
  );
};

export default TreemapGraph;
