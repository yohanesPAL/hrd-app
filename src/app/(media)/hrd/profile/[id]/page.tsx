import KaryawanProfile from "@/features/karyawan/components/KaryawanProfile";
import { getKaryawanContractAction } from "@/features/karyawan/contract/ContractAction";
import { getKaryawanById } from "@/features/karyawan/KaryawanAction";
import { Err } from "@/lib/err";

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = await params;
  const profile = await getKaryawanById(id);
  const contracts = await getKaryawanContractAction(id);

  if (!profile.data) throw new Err("invalid profile data", 500);

  return <KaryawanProfile profile={profile.data} contracts={contracts.data ?? []} />;
}