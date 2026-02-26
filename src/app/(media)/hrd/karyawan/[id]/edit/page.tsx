
import PageTitle from '@/components/PageTitle'
import KaryawanEditForm from '@/features/karyawan/components/KaryawanEditForm';
import { getKaryawanFormOptions, getKaryawanForUpdate } from '@/features/karyawan/KaryawanAction';

const EditKaryawan = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const [formOptions, karyawan] = await Promise.all([
    getKaryawanFormOptions(),
    getKaryawanForUpdate(id),
  ])

  return (
    <>
      <PageTitle>Edit Karyawan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <KaryawanEditForm id={id} karyawanData={karyawan} formOptions={formOptions}/>
      </div>
    </>
  )
}

export default EditKaryawan
