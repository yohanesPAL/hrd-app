import PageTitle from '@/components/PageTitle'
import KendaraanPage from '@/features/kendaraan/components/KendaraanPage'
import { getAllCarsAction } from '@/features/kendaraan/mobilAction'

const Kendaraan = async() => {
  const kendaraan = await getAllCarsAction();

  return (
    <>
      <PageTitle>Mobil</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <KendaraanPage carTable={kendaraan.data ?? []}/>
      </div>
    </>
  )
}

export default Kendaraan