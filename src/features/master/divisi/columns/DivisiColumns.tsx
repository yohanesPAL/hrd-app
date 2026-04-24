import { Stack, Button } from "react-bootstrap"
import { ColumnDef } from "@tanstack/react-table"
import { BaseDivision, DivisionForm, DivisionTable } from "@/modules/master/divisi/division.schema"

export const divisiColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (data: DivisionForm, id: BaseDivision["id"]) => void,
  onDelete: (id: BaseDivision["id"], nama: string) => void,
}): ColumnDef<DivisionTable>[] => [
    { accessorKey: "no", header: "No", sortingFn: "alphanumeric", size: 80 },
    { accessorKey: "nama", header: "Nama Divisi", size: 300 },
    {
      accessorKey: "is_active", header: "Status", size: 300, cell: ({ getValue }) => {
        return getValue() as boolean ? "Aktif" : "Non Aktif"
      },
      meta: {
        print: (value: boolean) => value ? "Aktif" : "Non Aktif"
      }
    },
    {
      id: "aksi", header: "Aksi", size: 200, cell: ({ row }) => {
        const id = row.original.id
        return (
          <Stack direction='horizontal' gap={2}>
            <Button type="button" variant='success' onClick={() => {
              onEdit(
                {
                  nama: row.original.nama,
                  is_active: row.original.is_active,
                },
                id
              )
            }}><i className="bi bi-pencil-fill"></i></Button>
            <Button type="button" variant='danger' onClick={() => {
              onDelete(id, row.original.nama)
            }}><i className="bi bi-trash-fill"></i></Button>
          </Stack>
        )
      }
    },
  ]