import PageTitle from '@/components/PageTitle'
import { getAllAbsen } from '@/features/absensi/AbsensiAction'
import AbsensiPage from '@/features/absensi/component/AbsensiPage'

const Absensi = async () => {
  const absensi = await getAllAbsen();

  return (
    <>
      <PageTitle>Absensi</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <AbsensiPage absensi={absensi}/>
      </div>
    </>
  )
}

export default Absensi