import PageTitle from '@/components/PageTitle'
import DivisiChart from '@/components/chart/dashboard/DivisiChart'
import KaryawanAktifChart from '@/components/chart/dashboard/KaryawanAktifChart'
import KaryawanTetap from '@/components/chart/dashboard/KaryawanTetap'
import React from 'react'
import { Stack } from 'react-bootstrap'

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-white page-container-border rounded w-100 pt-2'>
      {children}
    </div>
  )
}

const DivisiChartMemo = React.memo(()=> {return <DivisiChart />})

function Dashboard() {
  return (
    <div>
      <PageTitle>Dashboard</PageTitle>
      <Stack gap={3} direction='vertical'>
          <Card>
            <DivisiChartMemo/>
          </Card>
        <Stack direction='horizontal' gap={3}>
          <Card>
            <KaryawanAktifChart />
          </Card>
        <Card>
          <KaryawanTetap />
        </Card>
        </Stack>
      </Stack>
    </div>
  )
}

export default Dashboard