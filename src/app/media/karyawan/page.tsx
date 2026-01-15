"use client";
import ExportToExcel from '@/components/buttons/ExportToExcel';
import DefaultTable from '@/components/defaultTable/DefaulteTable'
import mockKaryawan from '@/mock/KaryawanMock'
import { KaryawanInt } from '@/type/KaryawanType'
import { exportTableToExcel } from '@/utils/exportTableToExcel';
import { ColumnDef, SortingState, Table } from '@tanstack/react-table'
import { useState } from 'react';
import { toast } from 'react-toastify';

const columns: ColumnDef<KaryawanInt>[] = [
  { accessorKey: "id", header: "Kode" },
  { accessorKey: "nama", header: "Nama" },
  { accessorKey: "jk", header: "Jenis Kelaim" },
  { accessorKey: "alamat", header: "Alamat" },
  { accessorKey: "hp", header: "HP",
    meta: {
      print: (value: any) => value ? value : "-",
    } },
  { accessorKey: "jabatan", header: "Jabatan" },
  { accessorKey: "divisi", header: "Divisi" },
  {
    accessorKey: "statusAktif", header: "Status", cell: ({ getValue }) => {
      return getValue() as boolean ? "Aktif" : "Non Aktif"
    },
    meta: {
      print: (value: any) => value ? "Aktif" : "Non Aktif",
    }
  },
  { accessorKey: "statusKontrak", header: "Status Kontrak" },
]

const defaultSort: SortingState = [{ id: 'id', desc: false }]

const Karyawan = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [table, setTable] = useState<Table<KaryawanInt> | null>(null)

  const onExport = () => {
    if (!table) {
      toast.error("Table tidak ditemukan");
      return;
    }
    exportTableToExcel<KaryawanInt>(table, "Karyawan")
  }

  return (
    <div>
      <h2>Karyawan</h2>
      <ExportToExcel onExport={onExport} />
      <DefaultTable<KaryawanInt>
        data={mockKaryawan}
        columns={columns}
        defaultSort={defaultSort}
        loading={tableLoading}
        tableWidth='105%'
        SetTableComponent={setTable}
      />
    </div>
  )
}

export default Karyawan