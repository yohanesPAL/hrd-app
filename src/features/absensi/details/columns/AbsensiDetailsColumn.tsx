"use client";
import { AbsensiDetailTable } from "@/modules/absensi/detail/absensi.detail.schema";
import { ColumnDef } from "@tanstack/react-table";

export const absensiDetailsColumn = (): ColumnDef<AbsensiDetailTable>[] => [
  { accessorKey: "no", header: "No", sortingFn: "alphanumeric" },
  { accessorKey: "tanggal", header: "Tanggal" },
  {
    id: "hari", header: "Hari", accessorFn: (row) => {
      const date = new Date(row.tanggal!)
      return date.toLocaleDateString("id-ID", { weekday: "long" })
    }
  },
  {
    accessorKey: "absent", header: "Hadir", accessorFn: (row) => row.absent ? "Tidak" : "Hadir",
  },
  { accessorKey: "scan_masuk", header: "Scan Masuk" },
  { accessorKey: "scan_keluar", header: "Scan Keluar" },
  {
    accessorKey: "terlambat", header: "Terlambat", sortingFn: "alphanumeric",
    cell: ({ getValue }) => {
      return `${(getValue() as String).toLocaleString("id-ID")} Menit`;
    }
  },
  {
    accessorKey: "lembur", header: "Lembur", sortingFn: "alphanumeric",
    cell: ({ getValue }) => {
      return `${(getValue() as String).toLocaleString("id-ID")} Menit`;
    }
  },
  {
    accessorKey: "jam_kerja", header: "Jam kerja", sortingFn: "alphanumeric",
    cell: ({ getValue }) => {
      return `${(getValue() as String).toLocaleString("id-ID")} Menit`;
    }
  },
]