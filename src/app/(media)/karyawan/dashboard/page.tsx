import { auth } from '@/auth'
import PageTitle from '@/components/PageTitle'
import DivisiChart from '@/components/Chart/dashboard/DivisiChart'
import KaryawanAktifChart from '@/components/Chart/dashboard/KaryawanAktifChart'
import KaryawanTetap from '@/components/Chart/dashboard/KaryawanTetap'
import { AccountId, UpcomingEvent as UpcomingEventType } from '@/modules/event/event.schema'
import UpcomingEvent from '@/components/Chart/dashboard/UpcomingEvent'
import React from 'react'
import { Stack } from 'react-bootstrap'
import { Card } from '@/features/dashboard/components/Card'
import { Err } from '@/lib/err'
import InternalServerError from '@/app/500/page'
import { getUpcomingEvents } from '@/features/dashboard/DashboardAction'

const DivisiChartMemo = React.memo(() => { return <DivisiChart /> })

async function Dashboard() {
  const session = await auth();
  if (!session) return null
  const id = session.user.id as AccountId;

  let upcomingEvents: UpcomingEventType[] = [];
  let onGoingEvents: UpcomingEventType[] = [];
  try {
    const {data} = await getUpcomingEvents(id);
    upcomingEvents = data.upcoming;
    onGoingEvents = data.onGoing;
  } catch (err) {
    if(err instanceof Err) {
      return <InternalServerError msg={err.message}/>
    }
  }

  return (
    <div>
      <PageTitle>Dashboard</PageTitle>
      <Stack gap={3} direction='vertical'>
        <Stack direction='horizontal' gap={3} className="align-items-stretch">
          <Card>
            <UpcomingEvent upcoming={upcomingEvents} ongoing={onGoingEvents} />
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