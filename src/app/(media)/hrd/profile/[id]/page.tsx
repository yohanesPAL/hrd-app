import PageTitle from "@/components/PageTitle";
import KaryawanProfile from "@/features/karyawan/components/KaryawanProfile";
import ContractsTable from "@/features/karyawan/contract/components/ContractsTable";
import { getKaryawanContractAction } from "@/features/karyawan/contract/ContractAction";
import { getKaryawanById } from "@/features/karyawan/KaryawanAction";
import { Err } from "@/lib/err";

export default async function Profile({ params }: { params: { id: string } }) {
  const { id } = await params;
  const profile = await getKaryawanById(id);
  const contracts = await getKaryawanContractAction(id);

  if (!profile.data) throw new Err("invalid profile data", 500);

  return (
    <>
      <PageTitle>Profile</PageTitle>
      <div className='page-container-border bg-white table-bg rounded p-2 pt-4'>
        <KaryawanProfile profile={profile.data} />
        <ContractsTable contracts={contracts.data ?? []} />
      </div>
    </>
  )
}