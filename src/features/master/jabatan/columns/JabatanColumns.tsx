import { BasePosition, PositionForm, PositionTable } from "@/modules/master/jabatan/jabatan.schema"
import { ColumnDef } from "@tanstack/react-table"
import { Button, Stack } from "react-bootstrap"

export const jabatanColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (data: PositionForm, id: BasePosition["id"]) => void,
  onDelete: (id: BasePosition["id"], nama: string) => void,
}): ColumnDef<PositionTable>[] => [
    { accessorKey: "no", header: "No", sortingFn: 'alphanumeric', size: 80 },
    { accessorKey: "nama", header: "Jabatan", size: 300 },
    { accessorKey: "nama_divisi", header: "Divisi", size: 300 },
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
        const kode = row.original.id
        return (
          <Stack direction='horizontal' gap={2}>
            <Button type="button" variant='success' onClick={() => {
              onEdit(
                {
                  id_divisi: row.original.id_divisi,
                  nama: row.original.nama,
                  is_active: row.original.is_active,
                },
                kode
              );
            }}><i className="bi bi-pencil-fill"></i></Button>
            <Button type="button" variant='danger' onClick={() => onDelete(kode, row.original.nama)}><i className="bi bi-trash-fill"></i></Button>
          </Stack>
        )
      }
    },
  ]