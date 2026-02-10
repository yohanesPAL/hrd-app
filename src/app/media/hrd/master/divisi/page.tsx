import PageTitle from '@/components/PageTitle'
import ClientPage from './clientPage'
import { ServerFetch } from '@/utils/ServerFetch';
import InternalServerError from '@/app/500/page';
import DataNotFound from '@/app/not-found/page';

const Divisi = async () => {  
  const res = await ServerFetch({ uri: `/divisi` })
  await new Promise(resolve => setTimeout(resolve, 2000))
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const err = body?.error ?? "Request failed";

    if (res.status === 404) return <DataNotFound />
    return <InternalServerError msg={err} />
  }

  let data: DivisiTable[] = await res.json();

  return (
    <>
      <PageTitle>Divisi</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage data={data} />
      </div>
    </>
  )
}

export default Divisi