import PageTitle from '@/components/PageTitle'
import KaryawanForm from '@/features/karyawan/components/KaryawanAddForm';
import { getKaryawanFormOptionsAction } from '@/features/karyawan/KaryawanAction'

const TambahKaryawan = async () => {
  const formOptions = await getKaryawanFormOptionsAction();

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