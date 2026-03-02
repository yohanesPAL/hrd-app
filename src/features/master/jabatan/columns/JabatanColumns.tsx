import { PositionForm, PositionTable } from "@/modules/master/jabatan/jabatan.schema"
import { ConfirmDeleteProps } from "@/stores/confirmDelete/confirmDelete.type"
import { ColumnDef } from "@tanstack/react-table"
import { Dispatch, SetStateAction } from "react"
import { Button, Stack } from "react-bootstrap"

export const jabatanColumns = ({
  setJabatanForm,
  setShow,
  openConfirmDelete,
  onDelete,
}: {
  setJabatanForm: Dispatch<SetStateAction<PositionForm>>,
  setShow: Dispatch<SetStateAction<boolean>>,
  openConfirmDelete: (props: ConfirmDeleteProps, onConfirm: (id: string) => void) => void,
  onDelete: (id: string) => void,
}): ColumnDef<PositionTable>[] => [
    { accessorKey: "no", header: "No", sortingFn: 'alphanumeric' },
    { accessorKey: "nama", header: "Jabatan" },
    { accessorKey: "nama_divisi", header: "Divisi" },
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
              setJabatanForm({
                id_divisi: row.original.id_divisi,
                nama: row.original.nama,
                is_active: row.original.is_active,
                id: kode,
              });
              setShow(true);
            }}><i className="bi bi-pencil-fill"></i></Button>
            <Button type="button" variant='danger' onClick={() => openConfirmDelete({ nama: row.original.nama, id: kode }, (id) => { onDelete(id) })}><i className="bi bi-trash-fill"></i></Button>
          </Stack>
        )
      }
    },
  ]