import { AbsensiTable } from "@/modules/absensi/absensi.schema";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "react-bootstrap";

export const absensiColumn = (role: string | undefined): ColumnDef<AbsensiTable>[] => [
  { accessorKey: "no", header: "No", sortingFn: "alphanumeric" },
  {
    accessorKey: "kode_absen",
    header: "Kode Absen",
    cell: ({ row }) => {
      return (
        <Link href={`/${role}/absensi/${row.original.kode_absen}`}>
          <Button type="button" variant="success" className='px-2 py-1'>{row.original.kode_absen}</Button>
        </Link>
      )
    },
  },
  { accessorKey: "nama_absen", header: "Nama" },
  { accessorKey: "divisi", header: "Divisi" },
  {
    accessorKey: "hadir",
    header: "Hadir",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => {
      return `${(getValue() as String).toLocaleString("id-ID")} Hari`;
    },
  },
  {
    accessorKey: "absent",
    header: "Absen",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => {
      return `${(getValue() as String).toLocaleString("id-ID")} Hari`;
    },
  },
  {
    accessorKey: "terlambat",
    header: "Terlambat",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => {
      return `${(getValue() as String).toLocaleString("id-ID")} Menit`;
    },
  },
  {
    accessorKey: "lembur",
    header: "Lembur",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => {
      return `${(getValue() as String).toLocaleString("id-ID")} Menit`;
    },
  },
  {
    accessorKey: "jam_kerja",
    header: "Jam Kerja",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => {
      return `${(getValue() as String).toLocaleString("id-ID")} Menit`;
    },
  },
];
