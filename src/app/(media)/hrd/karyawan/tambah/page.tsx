import PageTitle from '@/components/PageTitle'
import KaryawanForm from '@/features/karyawan/components/KaryawanAddForm';
import { getKaryawanFormOptions } from '@/features/karyawan/KaryawanAction'

const TambahKaryawan = async () => {
  const formOptions = await getKaryawanFormOptions();

  return (
    <>
      <PageTitle>Tambah Karyawan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <KaryawanForm formOptions={formOptions} />
      </div>
    </>
  )
}

export default TambahKaryawan