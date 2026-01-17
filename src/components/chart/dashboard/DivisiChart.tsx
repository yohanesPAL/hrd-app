'use client';
import divisiChart from '@/mock/dashboard/divisiChart'
import jabatanChart from '@/mock/dashboard/jabatanChart';
import percentageChartLabel from '../PercentageLabel'
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const DivisiChart = () => {
  return (
    <div style={{ width: "100%", height: 400 }} className='d-flex flex-column justify-content-center align-items-center'>
      <h3>Divisi dan Jabatan</h3>
      <ResponsiveContainer debounce={200}>
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            label={percentageChartLabel}
            labelLine={false}
            outerRadius="65%"
            data={divisiChart as any[]}
            dataKey={"value"}
            nameKey={"nama"}
            isAnimationActive={false}
          />
          <Pie
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius="70%"
            outerRadius="90%"
            data={jabatanChart as any[]}
            dataKey={"value"}
            nameKey={"nama"}
            isAnimationActive={false}
            legendType="none"
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DivisiChart