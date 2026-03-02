import { JamAbsenForm, JamAbsenTable } from "@/modules/master/jamAbsen/jamAbsen.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { Button, Stack } from "react-bootstrap";

export const jamAbsenColumns = ({
  setEditForm,
  setShow,
  onReset,
}: {
  setEditForm: Dispatch<SetStateAction<JamAbsenForm>>,
  setShow: Dispatch<SetStateAction<boolean>>,
  onReset: (id: string) => void,
}): ColumnDef<JamAbsenTable>[] => [
    { accessorKey: "no", header: "No", sortingFn: "alphanumeric" },
    { accessorKey: "nama_divisi", header: "Divisi" },
    { accessorKey: "masuk", header: "Jam Masuk" },
    { accessorKey: "keluar", header: "Jam Keluar" },
    { accessorKey: "keluar_sabtu", header: "Jam Keluar (Sabtu)" },
    {
      id: "aksi", header: "Aksi", cell: ({ row }: { row: any }) => {

        return (
          <Stack direction="horizontal" gap={2}>
            <Button type="button" variant="success" onClick={() => {
              setEditForm({
                id: row.original.id,
                nama_divisi: row.original.nama_divisi,
                masuk: row.original.masuk,
                keluar: row.original.keluar,
                keluar_sabtu: row.original.keluar_sabtu,
              });
              setShow(true);
            }}><i className="bi bi-pencil-fill"></i></Button>
            <Button type="button" variant="warning" onClick={() => { onReset(row.original.id) }}><i className="bi bi-arrow-counterclockwise"></i></Button>
          </Stack>
        )
      }
    },
  ]