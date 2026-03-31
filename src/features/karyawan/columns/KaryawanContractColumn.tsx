import { EmployeeContractForm, EmployeeContractTable } from "@/modules/employee/contract/employee.contract.schema";
import { ConfirmDeleteProps } from "@/stores/confirmDelete/confirmDelete.type";
import { formatDateDDMMYYYY } from "@/utils/dateFormatting";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Stack } from "react-bootstrap";

export const karyawanContractColumns = ({
  onEditContract,
  openConfirmDelete,
  onDelete,
}: {
  onEditContract: (id: string, data: EmployeeContractForm) => void
  openConfirmDelete: (props: ConfirmDeleteProps, onConfirm: (id: string) => void) => void,
  onDelete: (id: string) => void,
}): ColumnDef<EmployeeContractTable>[] => [
    { accessorKey: "no", header: "No", sortingFn: "alphanumeric" },
    {
      accessorKey: "jenis", header: "Jenis Kontrak", cell: ({ getValue }) => {
        const jenis = getValue() as string;
        return jenis.charAt(0).toUpperCase() + jenis.slice(1);
      }
    },
    {
      accessorKey: "tgl_kontrak", header: "Tgl Kontrak", cell: ({ row }) => {
        return formatDateDDMMYYYY(row.original.tgl_kontrak);
      }
    },
    {
      accessorKey: "tgl_berakhir", header: "Tgl Berakhir", cell: ({ row }) => {
        return row.original.tgl_berakhir ? formatDateDDMMYYYY(row.original.tgl_berakhir) : "-";
      }
    },
    {
      accessorKey: "total_kontrak", header: "Jangka Kontrak", cell: ({ row }) => {
        return row.original.total_kontrak !== 0 ? `${row.original.total_kontrak} Hari` : "-"
      }
    },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => {
        const id = row.original.id;
        return (
          <Stack direction="horizontal" gap={2}>
            <Button type="button" variant="success" onClick={() => onEditContract(id, {
              jenis: row.original.jenis,
              tgl_kontrak: row.original.tgl_kontrak,
              tgl_berakhir: row.original.tgl_berakhir,
              total_kontrak: 0,
              karyawan_id: "",
            })}><i className="bi bi-pencil-fill"></i></Button>
            <Button type="button" variant="danger" onClick={() => openConfirmDelete({ nama: "kontrak", id: id }, (id: string) => onDelete(id))}><i className="bi bi-trash-fill"></i></Button>
          </Stack>
        )
      }
    }
  ]