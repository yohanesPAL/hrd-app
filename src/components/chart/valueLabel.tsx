"use client";
import { PieLabel, PieLabelRenderProps } from 'recharts'

const RADIAN = Math.PI / 180;

const valueChartLabel: PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = (innerRadius + outerRadius) / 2;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {value}
    </text>
  );
};

export default valueChartLabel