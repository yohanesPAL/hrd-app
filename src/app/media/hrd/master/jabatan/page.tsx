import PageTitle from '@/components/PageTitle'
import { ServerFetch } from '@/utils/ServerFetch';
import ClientPage from './clientPage';
import InternalServerError from '@/app/500/page';
import DataNotFound from '@/app/not-found/page';

const Jabatan = async () => {
   const [tableRes, divisiListRes] = await Promise.all([
    ServerFetch({uri: "/jabatan"}),
    ServerFetch({uri: "/divisi"}),
  ])

  if (!tableRes.ok) {
    const body = await tableRes.json().catch(() => null);
    const err = body?.error ?? "Request Failed"

    if (tableRes.status === 404) return <DataNotFound />
    return <InternalServerError msg={err} />
  }

   if (!divisiListRes.ok) {
    const body = await divisiListRes.json().catch(() => null);
    const err = body?.error ?? "Request Failed"

    if (divisiListRes.status === 404) return <DataNotFound />
    return <InternalServerError msg={err} />
  }

  const [tableData, divisiListData] = await Promise.all([
    tableRes.json() as Promise<JabatanTable[]>,
    divisiListRes.json() as Promise<DivisiInterface[]>,
  ]);

  return (
    <>
      <PageTitle>Jabatan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <ClientPage data={tableData} divisiList={divisiListData}/>
      </div>
    </>
  )
}

export default Jabatan