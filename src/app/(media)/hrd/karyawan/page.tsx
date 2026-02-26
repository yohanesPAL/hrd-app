import PageTitle from '@/components/PageTitle';
import KaryawanPage from '@/features/karyawan/components/KaryawanPage';
import { getAllKaryawan } from '@/features/karyawan/KaryawanAction';

const Karyawan = async () => {
  const karyawan = await getAllKaryawan();

  return (
    <>
      <PageTitle>Karyawan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <KaryawanPage data={karyawan}/>
      </div>
    </>
  )
}

export default Karyawan