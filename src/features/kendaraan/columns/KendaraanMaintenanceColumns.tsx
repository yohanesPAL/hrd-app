import { CarMaintenanceForm, CarMaintenanceTable } from "@/modules/car/maintenance/car.maintenance.schema";
import { formatDateDDMMYYYY, formatDateYYYYMMDD } from "@/utils/dateFormatting";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Stack } from "react-bootstrap";

export const kendaraanMaintenanceColumns = ({
  onDelete,
  onEdit,
  isPending,
}: {
  onDelete: (id: string, nama: string) => void;
  onEdit: (id: string, data: CarMaintenanceForm) => void;
  isPending: boolean;
}): ColumnDef<CarMaintenanceTable>[] => [
    { accessorKey: "no", header: "No" },
    { accessorKey: "ket", header: "Keterangan" },
    {
      accessorKey: "tanggal", header: "Tanggal", cell: ({ row }) => {
        return formatDateDDMMYYYY(row.original.tanggal);
      }
    },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => {
        const rowData = row.original;
        const id = rowData.id;
        const ket = rowData.ket;
        return (
          <Stack direction="horizontal" gap={2}>
            <Button type="button" variant="warning" className="text-white" onClick={() =>
              onEdit(id,
                {
                  ket: ket,
                  tanggal: formatDateYYYYMMDD(rowData.tanggal),
                  id_kendaraan: rowData.id_kendaraan
                })}>
              <i className="bi bi-pencil-fill"></i>
            </Button>

            <Button type="button" variant="danger" className="text-white" onClick={() =>
              onDelete(id, ket)}>
              <i className="bi bi-trash-fill"></i>
            </Button>
          </Stack>
        )
      }
    },
  ]