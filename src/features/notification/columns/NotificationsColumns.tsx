import { NotificationTable } from "@/modules/notification/notification.schema";
import { formatDateDDMMYYYY } from "@/utils/dateFormatting";
import { ColumnDef } from "@tanstack/react-table";

export const NotificationColumns = (): ColumnDef<NotificationTable>[] => [
  {accessorKey: "no", header: "No", sortingFn: "alphanumeric"},
  {accessorKey: "judul", header: "Judul"},
  {accessorKey: "tipe", header: "Tipe"},
  {accessorKey: "teks", header: "Teks"},
  {accessorKey: "created_at", header: "Created at", cell: ({row}) => {
    return formatDateDDMMYYYY(row.original.created_at) ;
  }}
]