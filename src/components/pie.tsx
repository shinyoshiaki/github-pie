import React, { FunctionComponent } from "react";
import * as d3 from "d3";

const PieChart: FunctionComponent<{
  data?: { type: string; count: number }[];
  width: number;
  height: number;
}> = ({ data, width, height }) => {
  const radius = Math.min(width, height) / 2;

  const pie = d3
    .pie()
    .value((d: any) => d.count)
    .sort(null);

  const arc = d3
    .arc()
    .outerRadius(radius)
    .innerRadius(0);

  //  カリー化されててキモい
  const colors = (data: any) =>
    d3.scaleOrdinal(d3.schemeCategory10).domain(data.map((d: any) => d.type));

  const text = d3
    .arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 50);

  return (
    <div>
      {data && (
        <svg width={width} height={height}>
          <g transform={`translate(${width / 2},${height / 2})`}>
            {pie(data as any).map((d, i) => {
              return (
                <path
                  fill={colors(data)((d.data as any).type)}
                  d={arc(d as any) as any}
                  key={i}
                />
              );
            })}
            {pie(data as any).map((d, i) => (
              <g
                transform={`translate(${text.centroid(d as any)})`}
                dy={5}
                fontSize={15}
                textAnchor="middle"
                key={i}
              >
                <text>{(d.data as any).type}</text>
              </g>
            ))}
          </g>
        </svg>
      )}
    </div>
  );
};

export default PieChart;
