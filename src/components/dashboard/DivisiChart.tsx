"use client"
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, PieLabelRenderProps, Legend } from 'recharts'
import divisiChart from '@/mock/dashboard/divisiChart'

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const DivisiChart = () => {
  return (
    <div style={{ width: "100%", height: 400 }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          cx="50%"
          cy="50%"
          label={renderCustomizedLabel}
          labelLine={false}   
          outerRadius={120}
          data={divisiChart}
          dataKey={"jumlah"}
          nameKey={"divisi"}
          isAnimationActive
        />
        <Tooltip defaultIndex={2} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
    </div>
  )
}

export default DivisiChart