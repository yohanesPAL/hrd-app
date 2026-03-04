import PageTitle from '@/components/PageTitle'
import { auth } from '@/auth'
import { getEventsByAccount } from '@/features/kalender/KalendarAction';
import KalenderPage from '@/features/kalender/components/KalenderPage';

const Kalender = async ({ searchParams }: { searchParams: { month: string } }) => {
  const params = await searchParams;
  const now = new Date();
  const date = params.month ? new Date(params.month) : new Date(now.getFullYear(), now.getMonth(), 1);
  const session = await auth();
  const id = session?.user.id

  if (!id) return null;

  const {data} = await getEventsByAccount(id, date);
  return (
    <>
      <PageTitle>Kalender Acara</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <KalenderPage events={data} />
      </div>
    </>
  )
}

export default Kalender