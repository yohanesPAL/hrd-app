import PageTitle from '@/components/PageTitle';
import KaryawanPage from '@/features/karyawan/components/KaryawanPage';
import { getAllKaryawanAction } from '@/features/karyawan/KaryawanAction';

const Karyawan = async () => {
  const karyawan = await getAllKaryawanAction();

  return (
    <>
      <PageTitle>Karyawan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <KaryawanPage data={karyawan.data ?? []}/>
      </div>
    </>
  )
}

export default Karyawan