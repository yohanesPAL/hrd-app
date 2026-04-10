import PageTitle from '@/components/PageTitle';
import { getAbsenDetails } from '@/features/absensi/AbsensiAction';
import AbsensiDetailsPage from '@/features/absensi/details/components/AbsensiDetailsPage';

const AbsensiDetails = async ({ params }: { params: { kodeAbsen: string } }) => {
  const { kodeAbsen } = await params;
  const absensi = await getAbsenDetails(kodeAbsen);
  
  return (
    <>
    <PageTitle>Detail Absensi</PageTitle>
    <div className='page-container-border bg-white rounded p-2 pt-4'>
      <AbsensiDetailsPage absensi={absensi.data ?? []}/>
    </div>
    </>
  )
}

export default AbsensiDetails