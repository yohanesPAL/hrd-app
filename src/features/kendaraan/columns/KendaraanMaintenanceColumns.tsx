import { CarMaintenanceForm, CarMaintenanceTable } from "@/modules/car/maintenance/car.maintenance.schema";
import { ConfirmDeleteProps } from "@/stores/confirmDelete/confirmDelete.type";
import { formatDateDDMMYYYY, formatDateYYYYMMDD } from "@/utils/dateFormatting";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Stack } from "react-bootstrap";

export const kendaraanMaintenanceColumns = ({
  deleteMaintenance,
  onUpdateMaintenance,
}: {
  deleteMaintenance: {
    openConfirmDelete: (props: ConfirmDeleteProps, onConfirm: (id: string) => void) => void;
    onDelete: (id: string) => void;
  },
  onUpdateMaintenance: (id: string, data: CarMaintenanceForm) => void;
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
        const kode = row.original.id;
        const nama = row.original.ket;
        return (
          <Stack direction="horizontal" gap={2}>
            <Button type="button" variant="warning" className="text-white" onClick={() => onUpdateMaintenance(kode, { ket: row.original.ket, tanggal: formatDateYYYYMMDD(row.original.tanggal), id_kendaraan: row.original.id_kendaraan })}><i className="bi bi-pencil-fill"></i></Button>
            <Button type="button" variant="danger" className="text-white" onClick={() => deleteMaintenance.openConfirmDelete({ nama: nama, id: kode }, (id: string) => deleteMaintenance.onDelete(id))}><i className="bi bi-trash-fill"></i></Button>
          </Stack>
        )
      }
    },
  ]