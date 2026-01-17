"use client"
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend, PieLabel } from 'recharts'

const ResponsiveChart = ({ label, data, title }: { label?: PieLabel, data: any[], title: string }) => {
  return (
    <div style={{ width: "100%", height: 400 }} className='d-flex flex-column justify-content-center align-items-center'>
      <h3>{title}</h3>
      <ResponsiveContainer debounce={200}>
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            label={label}
            labelLine={false}
            outerRadius={130}
            data={data}
            dataKey={"value"}
            nameKey={"nama"}
            isAnimationActive={false}
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ResponsiveChart