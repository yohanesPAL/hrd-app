import PageTitle from '@/components/PageTitle'
import ClientPage from './clientPage'
import { ServerFetch } from '@/utils/ServerFetch'
import DataNotFound from '@/app/not-found/page'
import InternalServerError from '@/app/500/page'
import { auth } from '@/auth'

const Kalender = async () => {
  const session = await auth();
  const now = new Date();
  const tglMulai = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() - 1,
      1,
      0, 0, 0
    )
  );

  const tglAkhir = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + 2,
      1,
      0, 0, 0
    )
  );

  const res = await ServerFetch({ uri: `/acara/${session?.user.id}?tm=${tglMulai.toISOString()}&ta=${tglAkhir.toISOString()}` })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const err = body?.error ?? "Request failed"

    if (res.status === 404) return <DataNotFound />
    return <InternalServerError msg={err} />
  }

  let data: EventData[] = await res.json();
  data = data.map(item => ({...item, start: new Date(item.start), end: new Date(item.end)}));

  return (
    <>
      <PageTitle>Kalender Acara</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage data={data} />
      </div>
    </>
  )
}

export default Kalender