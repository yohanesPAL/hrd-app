import PageTitle from '@/components/PageTitle'
import ClientPage from './clientPage'
import { ServerFetch } from '@/utils/ServerFetch';

const page = async() => {
  let data: DivisiInterface[] | null = null;
  let err: any = null;
  const res = await ServerFetch({uri: `/divisi`})

  if(!res.ok) {
    const body = await res.json().catch(() => null);
    err = body?.error ?? "Request failed";
  } else {
    data = await res.json()
  }

  return (
    <>
      <PageTitle>Divisi</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage data={data} err={err}/>
      </div>
    </>
  )
}

export default page