import PageTitle from '@/components/PageTitle';
import ClientPage from './clientPage';
import { KaryawanInterface } from '@/types/KaryawanType';
import { ServerFetch } from '@/utils/ServerFetch';
import { redirect } from 'next/navigation';

const Karyawan = async() => {
  let data: KaryawanInterface[] | null = null;
  let err: string | null = null
  const res = await ServerFetch({ uri: `/karyawan` })

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    err = body?.error ?? "Request failed";
  } else {
    data = await res.json();
  }

  if(!data) redirect("/not-found");

  return (
    <>
      <PageTitle>Karyawan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage data={data} err={err}/>
      </div>
    </>
  )
}

export default Karyawan