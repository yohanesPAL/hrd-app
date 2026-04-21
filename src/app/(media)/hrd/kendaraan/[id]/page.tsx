import PageTitle from "@/components/PageTitle";
import KendaraanDetail from "@/features/kendaraan/components/KendaraanDetail";
import KendaraanMaintenance from "@/features/kendaraan/components/KendaraanMaintenance";
import { getCarMaintenanceByCarIdAction } from "@/features/kendaraan/maintenance/mobilMaintenanceAction";
import { getCarByIdAction } from "@/features/kendaraan/mobilAction";

const DetailKendaraan = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const kendaraan = await getCarByIdAction(id);
  const maintenance = await getCarMaintenanceByCarIdAction(id);

  return (
    <>
      <PageTitle>Kendaraan</PageTitle>
      <div className='page-container-border bg-white table-bg rounded p-2 pt-4'>
        <KendaraanDetail data={kendaraan.data} />

        <KendaraanMaintenance data={maintenance.data ?? []} idKendaraan={id} />
      </div>
    </>
  )
}

export default DetailKendaraan