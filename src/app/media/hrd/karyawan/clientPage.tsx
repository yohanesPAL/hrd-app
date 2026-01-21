"use client";
import ExportToExcel from '@/components/buttons/ExportToExcel'
import DefaultTable from '@/components/table/DefaulteTable'
import { KaryawanInterface } from '@/types/KaryawanType'
import { exportTableToExcel } from '@/utils/exportTableToExcel'
import { ColumnDef, SortingState, Table } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import useProfile from '@/stores/profile/profileStore';

const defaultSort: SortingState = [{ id: 'id', desc: false }]

const ClientPage = ({ data, err }: { data: KaryawanInterface[] | null, err: string | null }) => {
  const route = useRouter()
  const role = useProfile((state) => state.profile?.role)
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [table, setTable] = useState<Table<KaryawanInterface> | null>(null)

  const columns = useMemo<ColumnDef<KaryawanInterface>[]>(() => {
    return [
      {
        accessorKey: "id", header: "Kode", cell: ({ getValue }) => {
          const kode = getValue() as string;
          return <Link href={`media/${role}/profile/${kode}`} style={{ width: '100px' }}><Button type='button' variant='success'>{kode}</Button></Link>
        }
      },
      { accessorKey: "nama", header: "Nama" },
      { accessorKey: "jk", header: "Jenis Kelaim" },
      { accessorKey: "alamat", header: "Alamat" },
      {
        accessorKey: "hp", header: "HP",
        meta: {
          print: (value: any) => value ? value : "-",
        }
      },
      { accessorKey: "jabatan", header: "Jabatan" },
      { accessorKey: "divisi", header: "Divisi" },
      {
        accessorKey: "status_aktif", header: "Status", cell: ({ getValue }) => {
          return getValue() as boolean ? "Aktif" : "Non Aktif"
        },
        meta: {
          print: (value: any) => value ? "Aktif" : "Non Aktif",
        }
      },
      { accessorKey: "status_karyawan", header: "Status Karyawan" },
    ]
  }, [])

  const onExport = () => {
    if (!table) {
      toast.error("Table tidak ditemukan");
      return;
    }
    exportTableToExcel<KaryawanInterface>(table, "Karyawan")
  }

  if (!data) {
    route.replace("/not-found")
    return
  }

  return (
    <>
      <ExportToExcel onExport={onExport} />
      <DefaultTable<KaryawanInterface>
        data={data}
        columns={columns}
        defaultSort={defaultSort}
        loading={tableLoading}
        tableWidth='105%'
        SetTableComponent={setTable}
      />
    </>
  )
}

export default ClientPage