import PageTitle from '@/components/PageTitle'
import { getAllDepoAction } from '@/features/master/depo/DepoActions'
import KendaraanForm from '@/features/kendaraan/components/KendaraanForm'

const TambahKendaraan = async () => {
  const depo = await getAllDepoAction();
  return (
    <>
      <PageTitle>Tambah Kendaraan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <KendaraanForm depoOptions={depo.data ?? []}/>
      </div>
    </>
  )
}

export default TambahKendaraan