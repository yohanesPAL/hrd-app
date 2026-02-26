import KaryawanProfile from "@/features/karyawan/components/KaryawanProfile";
import { getKaryawanDetails } from "@/features/karyawan/KaryawanAction";

export default async function Profile({ params }: { params: { id: string } }) {
  const {id} = await params;
  const details = await getKaryawanDetails(id);
  return <KaryawanProfile data={details} />;
}