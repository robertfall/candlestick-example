import React, { useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { max, min } from "d3-array";
import { CandleStick } from "./use-stock-candlestick-chart";
import { AxisRight } from "@visx/axis";
import { GridRows } from "@visx/grid";

export const Chart: React.FC<{ data: CandleStick[] }> = (props) => {
  const width = 900;
  const height = 500;

  const [xMax, yMax] = [width - 50, height];

  const indexes = props.data.map((_, i) => i);
  const mappedY = useMemo(
    () => props.data.map((d) => [d.low, d.high]).flat(),
    [props.data]
  );

  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, xMax],
        round: true,
        domain: indexes,
      }),
    [xMax, indexes]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        nice: true,
        domain: [min(mappedY) || 0, max(mappedY) || 0],
      }),
    [yMax, mappedY]
  );

  return (
    <svg width={width} height={height}>
      <GridRows
        scale={yScale}
        width={xMax}
        height={yMax}
        stroke="#dfdfdf"
        strokeDasharray={"1"}
      />
      <Group>
        {props.data.map((d, i) => {
          const barWidth = xScale.bandwidth();
          const color = d.close < d.open ? "red" : "green";
          return (
            <Group key={i}>
              <Bar
                x={xScale(i)}
                y={yScale(d.close < d.open ? d.open : d.close)}
                width={barWidth}
                height={Math.abs(yScale(d.close) - yScale(d.open))}
                fill={color}
              />
              <Bar
                x={(xScale(i) ?? 0) + barWidth / 2 - barWidth * 0.05}
                y={yScale(d.high)}
                width={barWidth * 0.1}
                height={Math.abs(yScale(d.high) - yScale(d.low))}
                fill={color}
              />
            </Group>
          );
        })}
      </Group>
      <AxisRight left={width - 50} scale={yScale} />
    </svg>
  );
};
