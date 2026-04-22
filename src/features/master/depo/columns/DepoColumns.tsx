import { DepoForm, DepoTable } from "@/modules/depo/depo.schema";
import { ConfirmDeleteProps } from "@/stores/confirmDelete/confirmDelete.type";
import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { Button, Stack } from "react-bootstrap";

export const depoColumns = ({
  updateDepo,
  deleteDepo,
  isPosting,
}: {
  updateDepo: {
    setShowModal: Dispatch<SetStateAction<boolean>>,
    setDepoForm: Dispatch<SetStateAction<DepoForm>>,
    setDepoOnEdit: Dispatch<SetStateAction<string>>,
  },
  deleteDepo: {
    openConfirmDelete: (props: ConfirmDeleteProps, onConfirm: (id: string) => void) => void,
    onDelete: (id: string) => void,
  },
  isPosting: boolean
}): ColumnDef<DepoTable>[] => [
    { accessorKey: "no", header: "No", sortingFn: "alphanumeric", size: 20 },
    {
      accessorKey: "nama", header: "Nama", size: 600, cell: ({ getValue }) => {
        const nama = getValue() as string
        return nama[0].toUpperCase() + nama.slice(1)
      }
    },
    {
      id: "aksi", header: "Aksi", size: 100, cell: ({ row }) => {
        return (
          <Stack direction="horizontal" gap={2}>
            <Button type="button" variant="warning" className="text-white" disabled={isPosting} onClick={() => {
              updateDepo.setDepoOnEdit(row.original.id)
              updateDepo.setDepoForm({ nama: row.original.nama })
              updateDepo.setShowModal(true);
            }}><i className="bi bi-pencil-fill"></i></Button>
            <Button type="button" variant="danger" disabled={isPosting}><i className="bi bi-trash-fill" onClick={() => {
              deleteDepo.openConfirmDelete({ nama: row.original.nama, id: row.original.id }, (id: string) => deleteDepo.onDelete(id))
            }}></i></Button>
          </Stack>
        )
      }
    },
  ]