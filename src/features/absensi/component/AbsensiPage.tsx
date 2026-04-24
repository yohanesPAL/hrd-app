'use client';
import DefaultTable from "@/components/Table/DefaulteTable";
import { AbsensiTable } from "@/modules/absensi/absensi.schema";
import { SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Button, Stack } from "react-bootstrap";
import { absensiColumn } from "../columns/AbsensiColumns";
import useProfile from "@/stores/profile/profile.store";

const defaultSort: SortingState = [{ id: "no", desc: false }];

const AbsensiPage = ({ absensiTable }: { absensiTable: AbsensiTable[] }) => {
  const router = useRouter();
  const role = useProfile(state => state.profile?.role);

  return (
    <>
      <Button type="button" variant="success" onClick={() => router.push("absensi/import")}>
        <Stack direction="horizontal" gap={2}>
          <span>Import</span>
          <i className="bi bi-file-earmark-arrow-up-fill"></i>
        </Stack>
      </Button>

      <DefaultTable<AbsensiTable>
        data={absensiTable}
        defaultSort={defaultSort}
        columns={absensiColumn(role)}
      />
    </>
  )
}

export default AbsensiPage