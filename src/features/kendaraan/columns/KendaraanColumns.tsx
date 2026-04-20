import { CarTable } from "@/modules/car/car.schema";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button, Stack } from "react-bootstrap";

export const kendaraanColumns = ({
  role,
  router,
}:{
  role: string | undefined,
  router: any
}): ColumnDef<CarTable>[] => [
  { accessorKey: "no", header: "No" },
  { accessorFn: (row) => `${row.nama}-${row.id}`, header: "Nama", cell:({row})  => {
    return (
          <Link href={`/${role}/kendaraan/${row.original.id}`}>
            <Button type='button' variant='success' className='px-2 py-1'>{row.original.nama}-{row.original.id}</Button>
          </Link>
        )
  } },
  { accessorKey: "nopol", header: "Plat" },
  { accessorKey: "jenis", header: "Jenis" },
  { accessorKey: "depo", header: "Depo" },
  { accessorKey: "status", header: "Status" },
  {id: "aksi", header: "Aksi", cell:({row}) => {
    const kode = row.original.id;
    return(
      <Stack direction="horizontal" gap={2}>
        <Button type="button" variant="warning" className="text-white" onClick={() => router.push(`kendaraan/${kode}/edit`)}><i className="bi bi-pencil-fill"></i></Button>
        <Button type="button" variant="danger" className="text-white"><i className="bi bi-trash-fill"></i></Button>
      </Stack>
    )
  }}
]