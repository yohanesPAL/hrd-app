import PageTitle from '@/components/PageTitle';
import KendaraanEditForm from '@/features/kendaraan/components/KendaraanEditForm';
import { getCarByIdAction } from '@/features/kendaraan/mobilAction';
import { getAllDepoAction } from '@/features/master/depo/DepoActions';
import { Err } from '@/lib/err';

const EditKendaraan = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const dataKendaraan = await getCarByIdAction(id);
  if(!dataKendaraan.data) throw new Err("invalid karyawan data", 500)

  const depo = await getAllDepoAction()

  return (
    <>
      <PageTitle>Edit Kendaraan</PageTitle>
      <div className='page-container-border bg-white rounded p-2 pt-4'>
        <KendaraanEditForm id={id} data={dataKendaraan.data} depoOptions={depo.data ?? []}/>
      </div>
    </>
  )
}

export default EditKendaraan