import PageTitle from '@/components/PageTitle'
import ClientPage from './clientPage'
import { ServerFetch } from '@/utils/ServerFetch'
import DataNotFound from '@/app/not-found/page'
import InternalServerError from '@/app/500/page'

const AbsenDivisi = async () => {
  const res = await ServerFetch({ uri: `/absen-divisi/table` })

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const err = body?.error ?? "Request Failed";

    if (res.status === 404) return <DataNotFound />
    return <InternalServerError msg={err} />
  }

  let data: AbsenDivisiTable[] = await res.json();

  return (
    <>
      <PageTitle>Absen Divisi</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage data={data} />
      </div>
    </>
  )
}

export default AbsenDivisi