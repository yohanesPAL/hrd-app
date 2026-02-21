import { Stack, Button } from "react-bootstrap"
import { ColumnDef } from "@tanstack/react-table"
import { Dispatch, SetStateAction } from "react"
import { ConfirmDeleteProps } from "@/stores/confirmDelete/confirmDelete.type"
import { DivisionForm, DivisionTable } from "@/modules/divisi/division.schema"

export const divisiColumns = ({
  setEditingId,
  setDivisiForm,
  setShow,
  openConfirmDelete,
  onDelete,

}: {
  setEditingId: Dispatch<SetStateAction<string>>,
  setDivisiForm: Dispatch<SetStateAction<DivisionForm>>,
  setShow: Dispatch<SetStateAction<boolean>>,
  openConfirmDelete: (props: ConfirmDeleteProps, onConfirm: (id: string) => void) => void,
  onDelete: (id: string) => void,

}): ColumnDef<DivisionTable>[] => [
    { accessorKey: "no", header: "No", sortingFn: "alphanumeric" },
    { accessorKey: "nama", header: "Nama Divisi" },
    {
      accessorKey: "is_active", header: "Status", cell: ({ getValue }) => {
        return getValue() as boolean ? "Aktif" : "Non Aktif"
      },
      meta: {
        print: (value: boolean) => value ? "Aktif" : "Non Aktif"
      }
    },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => {
        const kode = row.original.id
        return (
          <Stack direction='horizontal' gap={2}>
            <Button type="button" variant='success' onClick={() => {
              setEditingId(kode);
              setDivisiForm({ nama: row.original.nama, is_active: row.original.is_active });
              setShow(true);
            }}><i className="bi bi-pencil-fill"></i></Button>
            <Button type="button" variant='danger' onClick={() => {
              openConfirmDelete(
                { nama: row.original.nama, id: kode },
                (id: string) => { onDelete(id) }
              )
            }}><i className="bi bi-trash-fill"></i></Button>
          </Stack>
        )
      }
    },
  ]