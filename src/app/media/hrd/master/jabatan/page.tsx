import PageTitle from '@/components/PageTitle'
import { ServerFetch } from '@/utils/ServerFetch';
import ClientPage from './clientPage';
import InternalServerError from '@/app/500/page';
import DataNotFound from '@/app/not-found/page';

const Jabatan = async () => {
  let data: JabatanTable[] | null = null;
  let err: any = null;
  const res = await ServerFetch({ uri: `/jabatan` })

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    err = body?.error ?? "Request failed";
    if(res.status === 500) return <InternalServerError msg={err}/>
    if(res.status === 404) return <DataNotFound/>
  } else {
    data = await res.json()
  }
  
  return (
    <>
      <PageTitle>Jabatan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage data={data} err={err}/>
      </div>
    </>
  )
}

export default Jabatan