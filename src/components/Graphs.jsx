import React from "react";
import PropTypes from "prop-types";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryLabel,
  createContainer
} from "victory";

import { UNITS, PRETTY_PARAMS } from "../utils/constants";

const [ORANGE, GREEN] = ["rgb(218,124,48)", "rgb(62,150,81)"];

const styles = {
  axisX: {
    axis: { stroke: "black", strokeWidth: 3 },
    ticks: { strokeWidth: 0 },
    tickLabels: { fill: "black", fontFamily: "inherit", fontSize: 7 }
  },
  axisYL: {
    grid: {
      stroke: "hsla(0,0%,10%,15%)",
      strokeWidth: 2
    },
    axis: { stroke: ORANGE, strokeWidth: 3 },
    ticks: { strokeWidth: 0 },
    tickLabels: { fill: "hsl(0,0%,40%)", fontFamily: "inherit", fontSize: 10 }
  },
  axisYR: {
    axis: { stroke: GREEN, strokeWidth: 3 },
    ticks: { strokeWidth: 0 },
    tickLabels: {
      fill: "hsl(0,0%,40%)",
      fontFamily: "inherit",
      fontSize: 10
    }
  },
  lineL: {
    data: { stroke: ORANGE },
    parent: { border: "1px solid #ccc", background: "#ccdee8" }
  },
  lineR: {
    data: { stroke: GREEN },
    parent: { border: "1px solid #ccc", background: "#ccdee8" }
  }
};

// Returns the cursor (vertical bar following mouse on hover).
const getCursor = (data, parameterL, parameterR, showR) => {
  return ({ x, y, active, text }) => {
    const len = data.length;
    const ind = Math.round(((x - 50) / 350) * (len - 1));
    const found = data.find(val => (val.time >= text))
    if (found == null) { return <g />}
    const textAnchor = ind > len / 2 ? "end" : "start";
    const offX = ind > len / 2 ? -5 : 5;
    const offY = showR ? 14 : 0;
    const [uL, uR] = [UNITS[parameterL], UNITS[parameterR]];
    return (
      <g>
        <text
          x={x + offX}
          y={y - 28 - offY}
          style={{
            fill: "hsl(0,0%,20%)",
            textAnchor,
            fontWeight: "500",
            fontSize: 12
          }}
        >{`${found.time.toLocaleDateString([], {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit"
        })}`}</text>
        <text
          x={x + offX}
          y={y - 14 - offY}
          style={{
            fill: "hsl(0,0%,20%)",
            textAnchor,
            fontWeight: "500",
            fontSize: 12
          }}
        >{`${found.time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })}`}</text>
        <text
          x={x + offX}
          y={y - offY}
          style={{ textAnchor, fill: ORANGE, fontSize: 12 }}
        >{`${found[parameterL].toFixed(2)}${uL}`}</text>
        {showR && 
        <text
          x={x + offX}
          y={y}
          style={{ textAnchor, fill: GREEN, fontSize: 12 }}
        >{`${found[parameterR].toFixed(2)}${uR}`}</text> }
        <path
          d={`M${x},250 L${x},50`}
          style={{ strokeWidth: 1, stroke: "hsl(0,0%,40%)" }}
        />
      </g>
    );
  };
};

const Null = () => null;

const ChartContainer = createContainer("zoom", "cursor");

const GraphComp = ({ data, parameterL, parameterR, minmax, showR }) => {
  const Cursor = getCursor(data, parameterL, parameterR, showR);

  return (
    <VictoryChart
      scale={{x:'time'}}
      animate={{
        duration: 500,
        onLoad: { duration: 500 }
      }}
      style={{
        parent: {
          background: "#ccdee8",
          boxShadow: '0px 0px 10px'
        }
      }}
      containerComponent={
        <ChartContainer
          cursorLabel={d => d.x}
          cursorLabelComponent={<Cursor />}
          cursorLabelOffset={0}
          cursorComponent={<Null />}
        />
      }
      width={450}
      height={300}
    >
      <VictoryLabel
        x={25}
        y={25}
        text={`${PRETTY_PARAMS[parameterL]} \n ${UNITS[parameterL]}`}
        style={{ fontSize: 12, fill: ORANGE }}
      />
      {showR && 
      <VictoryLabel
        x={370}
        y={25}
        text={`${PRETTY_PARAMS[parameterR]} \n ${UNITS[parameterR]}`}
        style={{ fontSize: 12, fill: GREEN }}
      /> }

      <VictoryAxis
        scale="time"
        style={styles.axisX}
        tickCount={11}
        offsetY={50}
      />

      <VictoryAxis
        dependentAxis
        style={styles.axisYL}
        orientation="left"
        tickValues={[0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]}
        tickFormat={t =>
          parseFloat(
            (
              minmax[parameterL][0] +
              t * (minmax[parameterL][1] - minmax[parameterL][0])
            ).toFixed(2)
          )
        }
      />

      <VictoryLine
        style={styles.lineL}
        domain={{ y: [-0.1, 1.1] }}
        data={data}
        x="time"
        y={d =>
          (d[parameterL] - minmax[parameterL][0]) /
          (minmax[parameterL][1] - minmax[parameterL][0])
        }
        interpolation="linear"
      />

      {showR && (
        <VictoryAxis
          dependentAxis
          style={styles.axisYR}
          orientation="right"
          tickValues={[0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]}
          // Re-scale ticks by multiplying by correct maxima
          tickFormat={t =>
            parseFloat(
              (
                minmax[parameterR][0] +
                t * (minmax[parameterR][1] - minmax[parameterR][0])
              ).toFixed(2)
            )
          }
        />
      )}

      {showR && (
        <VictoryLine
          style={styles.lineR}
          domain={{ y: [-0.1, 1.1] }}
          data={data}
          x="time"
          y={d =>
            (d[parameterR] - minmax[parameterR][0]) /
            (minmax[parameterR][1] - minmax[parameterR][0])
          }
          interpolation="linear"
        />
      )}
    </VictoryChart>
  );
};

GraphComp.propTypes = {
  // Data of the station to plot.
  data: PropTypes.array,
  // Parameter to plot on the left axis.
  parameterL: PropTypes.string,
  // Parameter to plot on the right axis.
  parameterR: PropTypes.string,
  // Array containing the min and max for each parameter, so that we ca scale the data.
  minmax: PropTypes.object,
  // If true show the second parameter, else don't.
  showR: PropTypes.bool
};

export default GraphComp;
