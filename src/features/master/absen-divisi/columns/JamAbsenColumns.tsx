import { JamAbsenForm, JamAbsenTable } from "@/modules/master/jamAbsen/jamAbsen.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { Button, Stack } from "react-bootstrap";

export const jamAbsenColumns = ({
  setForm,
  setShowModal,
  onReset,
}: {
  setForm: Dispatch<SetStateAction<JamAbsenForm>>,
  setShowModal: Dispatch<SetStateAction<boolean>>,
  onReset: (id: string) => void,
}): ColumnDef<JamAbsenTable>[] => [
    { accessorKey: "no", header: "No", sortingFn: "alphanumeric", size: 80 },
    { accessorKey: "nama_divisi", header: "Divisi", size: 300 },
    { accessorKey: "masuk", header: "Jam Masuk", size: 300 },
    { accessorKey: "keluar", header: "Jam Keluar", size: 300 },
    { accessorKey: "keluar_sabtu", header: "Jam Keluar (Sabtu)", size: 300 },
    {
      id: "aksi", header: "Aksi", size: 200, cell: ({ row }: { row: any }) => {

        return (
          <Stack direction="horizontal" gap={2}>
            <Button type="button" variant="success" onClick={() => {
              setForm({
                id: row.original.id,
                nama_divisi: row.original.nama_divisi,
                masuk: row.original.masuk,
                keluar: row.original.keluar,
                keluar_sabtu: row.original.keluar_sabtu,
              });
              setShowModal(true);
            }}><i className="bi bi-pencil-fill"></i></Button>
            <Button type="button" variant="warning" onClick={() => { onReset(row.original.id) }}><i className="bi bi-arrow-counterclockwise"></i></Button>
          </Stack>
        )
      }
    },
  ]