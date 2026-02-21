import { param } from 'motion/react-client'
import EditKaryawanForm from './editKaryawanForm'
import PageTitle from '@/components/PageTitle'
import { ServerFetch } from '@/utils/ServerFetch';
import DataNotFound from '@/app/not-found/page';
import InternalServerError from '@/app/500/page';

const EditKaryawan = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

 const [karyawanRes, depedenciesRes] = await Promise.all([
  ServerFetch({ uri: `/karyawan/${id}/info` }),
  ServerFetch({ uri: `/karyawan/form-depedencies` }),
 ])

  if(!karyawanRes.ok) {
    const body = await karyawanRes.json().catch(() => null);
    const err = body?.error ?? "Request Failed"

    if(karyawanRes.status === 404) return <DataNotFound/>
    return <InternalServerError msg={err}/>
  }

  const karyawanJson: KaryawanEditForm[] = await karyawanRes.json();
  const data: KaryawanEditForm = karyawanJson[0]
  data.id = id;

  if(!depedenciesRes.ok) {
    const body = await depedenciesRes.json().catch(() => null);
    const err = body?.error ?? "Request Failed"

    if(depedenciesRes.status === 404) return <DataNotFound/>
    return <InternalServerError msg={err}/>
  }

  const depedencies: KaryawanFormDepedencies = await depedenciesRes.json();

  return (
    <>
      <PageTitle>Edit Karyawan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <EditKaryawanForm karyawanData={data} depedencies={depedencies}/>
      </div>
    </>
  )
}

export default EditKaryawan
