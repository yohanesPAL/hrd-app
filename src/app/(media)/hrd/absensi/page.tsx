import PageTitle from '@/components/PageTitle'
import { getAllAbsenAction } from '@/features/absensi/AbsensiAction'
import AbsensiPage from '@/features/absensi/component/AbsensiPage'

const Absensi = async () => {
  const absensi = await getAllAbsenAction();

  return (
    <>
      <PageTitle>Absensi</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <AbsensiPage absensiTable={absensi.data ?? []}/>
      </div>
    </>
  )
}

export default Absensi