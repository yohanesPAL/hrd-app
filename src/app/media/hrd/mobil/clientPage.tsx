"use client"
import DefaultTable from '@/components/table/DefaulteTable'
import { ColumnDef, Table } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

const defaultSort = [{id:"id", desc: false}]

const ClientPage = ({data}:{data: Mobil[]}) => {
  const [table, setTable] = useState<Table<Mobil> | null>(null);

  const columns = useMemo<ColumnDef<Mobil>[]>(() => {
    return [
      { accessorKey: "id", header: "Kode" },
      { accessorKey: "nama", header: "Nama" },
      { accessorKey: "jenis", header: "Jenis" },
      { accessorKey: "merk", header: "Merk" },
      { accessorKey: "plat", header: "Plat" },
      { accessorKey: "depo", header: "Depo" },
      { accessorKey: "tahun", header: "Tahun" },
      { accessorKey: "jumlah_roda", header: "Jumlah Roda" },
      { accessorKey: "status", header: "Status" },
    ]
  }, [])
  return (
    <>
      <DefaultTable<Mobil>
        data={data ?? []}
        columns={columns}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
      />
    </>
  )
}

export default ClientPage