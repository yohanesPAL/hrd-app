import PageTitle from '@/components/PageTitle';
import ClientPage from './clientPage';
import { ServerFetch } from '@/utils/ServerFetch';
import DataNotFound from '@/app/not-found/page';
import InternalServerError from '@/app/500/page';

const Karyawan = async () => {
  const res = await ServerFetch({ uri: `/karyawan` })

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const err = body?.error ?? "Request Failed"

    if (res.status === 404) return <DataNotFound />
    return <InternalServerError msg={err} />
  }

  const data: KaryawanTable[] = await res.json();

  return (
    <>
      <PageTitle>Karyawan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage data={data} />
      </div>
    </>
  )
}

export default Karyawan