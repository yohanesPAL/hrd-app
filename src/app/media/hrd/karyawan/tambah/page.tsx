import PageTitle from '@/components/PageTitle'
import KaryawanForm from './karyawanForm'
import { ServerFetch } from '@/utils/ServerFetch';
import InternalServerError from '@/app/500/page';
import DataNotFound from '@/app/not-found/page';

const TambahKaryawan = async () => {
  const res = await ServerFetch({ uri: `/karyawan/form-depedencies` })

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const err = body?.error ?? "Request failed";

    if (res.status === 404) return <DataNotFound />
    return <InternalServerError msg={err} />
  }

  const data: KaryawanFormDepedencies = await res.json();

  return (
    <>
      <PageTitle>Tambah Karyawan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <KaryawanForm depedencies={data} />
      </div>
    </>
  )
}

export default TambahKaryawan