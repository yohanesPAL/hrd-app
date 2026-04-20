import PageTitle from "@/components/PageTitle";
import KendaraanDetail from "@/features/kendaraan/components/KendaraanDetail";
import { getCarMaintenanceByCarIdAction } from "@/features/kendaraan/maintenance/mobilMaintenanceAction";
import { getCarByIdAction } from "@/features/kendaraan/mobilAction";

const DetailKendaraan = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const kendaraan = await getCarByIdAction(id);
  const maintenance = await getCarMaintenanceByCarIdAction(id);
  console.log(maintenance);

  return (
    <>
      <PageTitle>Kendaraan</PageTitle>
      <KendaraanDetail data={kendaraan.data}/>


    </>
  )
}

export default DetailKendaraan