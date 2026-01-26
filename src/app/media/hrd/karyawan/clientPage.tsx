"use client";
import ExportToExcel from '@/components/buttons/ExportToExcel'
import DefaultTable from '@/components/table/DefaulteTable'
import { exportTableToExcel } from '@/utils/exportTableToExcel'
import { ColumnDef, SortingState, Table } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation';
import { Button, Stack } from 'react-bootstrap';
import Link from 'next/link';
import useProfile from '@/stores/profile/ProfileStore';

const defaultSort: SortingState = [{ id: 'urutan', desc: false }]

const ClientPage = ({ data }: { data: KaryawanTable[] }) => {
  const route = useRouter()
  const role = useProfile((state) => state.profile?.role)
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [table, setTable] = useState<Table<KaryawanTable> | null>(null)

  const columns = useMemo<ColumnDef<KaryawanTable>[]>(() => {
    return [
      { accessorKey: "urutan", header: "No", sortingFn: "alphanumeric" },
      {
        accessorKey: "nama", header: "Nama", cell: ({ row }) => {
          return (
            <Link href={`/media/${role}/profile/${row.original.id}`}>
              <Button type='button' variant='success'>{row.original.nama}</Button>
            </Link>
          )
        }
      },
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
    exportTableToExcel<KaryawanTable>(table, "Karyawan")
  }

  return (
    <>
      <Stack direction='horizontal' gap={2}>
        <Button type='button' variant='primary' onClick={() => route.push(`/media/${role}/karyawan/tambah`)}>
          <i className='bi bi-person-fill'></i>
          <span>Tambah</span>
        </Button>
        <ExportToExcel onExport={onExport} />
      </Stack>
      <DefaultTable<KaryawanTable>
        data={data ?? []}
        columns={columns}
        defaultSort={defaultSort}
        loading={tableLoading}
        SetTableComponent={setTable}
      />
    </>
  )
}

export default ClientPage