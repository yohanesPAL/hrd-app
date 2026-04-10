import PageTitle from '@/components/PageTitle'
import { getJamAbsenAction } from '@/features/master/absen-divisi/jamAbsenAction'
import JamAbsenPage from '@/features/master/absen-divisi/components/JamAbsenPage';

const AbsenDivisi = async () => {
  const jamAbsen = await getJamAbsenAction();
  return (
    <>
      <PageTitle>Absen Divisi</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <JamAbsenPage data={jamAbsen.data ?? []} />
      </div>
    </>
  )
}

export default AbsenDivisi