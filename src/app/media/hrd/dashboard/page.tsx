import InternalServerError from '@/app/500/page'
import DataNotFound from '@/app/not-found/page'
import PageTitle from '@/components/PageTitle'
import DivisiChart from '@/components/chart/dashboard/DivisiChart'
import KaryawanAktifChart from '@/components/chart/dashboard/KaryawanAktifChart'
import KaryawanTetap from '@/components/chart/dashboard/KaryawanTetap'
import UpcomingEvent from '@/components/chart/dashboard/UpcomingEvent'
import { ServerFetch } from '@/utils/ServerFetch'
import React from 'react'
import { Stack } from 'react-bootstrap'

const isActive = (start: Date, end: Date) => {
  const now = new Date();
  return now <= new Date(end) && now >= new Date(start);
}

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-white page-container-border rounded w-100 pt-2'>
      {children}
    </div>
  )
}

const DivisiChartMemo = React.memo(() => { return <DivisiChart /> })

async function Dashboard() {

  const res = await ServerFetch({ uri: "/acara/upcoming" })
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const err = body?.error ?? "Request failed"
    if (res.status === 404) return <DataNotFound />
    return <InternalServerError msg={err} />
  }

  const events: EventForm[] = await res.json();

  let upcomingEvents: EventForm[] = [], onGoingEvents: EventForm[] = [];

  events.forEach(event => {
    if (isActive(event.start, event.end)) {
      onGoingEvents.push(event);
    } else {
      upcomingEvents.push(event);
    }
  })

  return (
    <div>
      <PageTitle>Dashboard</PageTitle>
      <Stack gap={3} direction='vertical'>
        <Stack direction='horizontal' gap={3} className="align-items-stretch">
          <Card>
            <UpcomingEvent upcoming={upcomingEvents} ongoing={onGoingEvents}/>
          </Card>
          <Card>
            <DivisiChartMemo />
          </Card>
        </Stack>
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