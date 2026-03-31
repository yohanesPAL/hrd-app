import KaryawanProfile from "@/features/karyawan/components/KaryawanProfile";
import { getKaryawanById } from "@/features/karyawan/KaryawanAction";

export default async function Profile({ params }: { params: { id: string } }) {
  const {id} = await params;
  const {data} = await getKaryawanById(id);
  return <KaryawanProfile data={data} />;
}