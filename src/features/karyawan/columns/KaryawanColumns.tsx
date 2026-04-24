import { EmployeeKodeAbsenForm, EmployeeSpForm, EmployeeTable } from "@/modules/employee/employee.schema"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Dispatch, SetStateAction } from "react"
import { Button, Stack } from "react-bootstrap"
import { KaryawanOnEdit } from "../types/KaryawanTypes"
import { formatDateDDMMYYYY } from "@/utils/dateFormatting"

export const karyawanColumns = ({
  role,
  router,
  employee,
  modal,
}: {
  role: string | undefined,
  router: any,
  employee: {
    setOnEdit: Dispatch<SetStateAction<KaryawanOnEdit>>,
    setAbsentCodeForm: Dispatch<SetStateAction<EmployeeKodeAbsenForm>>,
    setSpForm: Dispatch<SetStateAction<EmployeeSpForm>>,
    onDelete: (id: string, nama: string) => void,
  },
  modal: {
    setShowAbsen: Dispatch<SetStateAction<boolean>>,
    setShowSp: Dispatch<SetStateAction<boolean>>,
  }
}): ColumnDef<EmployeeTable>[] => [
    { accessorKey: "no", header: "No", sortingFn: "alphanumeric",size: 80 },
    {
      accessorKey: "nama", header: "Nama", size: 300, cell: ({ row }) => {
        return (
          <Link href={`/${role}/profile/${row.original.id}`}>
            <Button type='button' variant='success' className='px-2 py-1' style={{textAlign: "start"}}>{row.original.nama}</Button>
          </Link>
        )
      }
    },
    { accessorKey: "jk", header: "Jenis Kelamin" },
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
      accessorKey: "is_active", header: "Status", cell: ({ getValue }) => {
        return getValue() as boolean ? "Aktif" : "Non Aktif"
      },
      meta: {
        print: (value: any) => value ? "Aktif" : "Non Aktif",
        getRowClassName(value) {
          return value ? "" : "table-dark";
        },
      }
    },
    {
      accessorKey: "jenis_kontrak", header: "Status Karyawan", cell: ({ getValue }) => {
        const kontrak = getValue() as string | null;
        return kontrak ? kontrak.charAt(0).toUpperCase() + kontrak.slice(1) : "-"
      }
    },
    {
      accessorKey: "tgl_berakhir", header: "Tgl Akhir Kontrak", cell: ({ getValue }) => {
        return !getValue() ? "-" : formatDateDDMMYYYY(getValue() as Date)
      }
    },
    { accessorKey: "kode_absensi", header: "Kode Absen" },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => {
        const id = row.original.id
        const nama = row.original.nama
        return (
          <Stack direction='horizontal' gap={2}>
            <Button type='button'
              onClick={() => {
                employee.setOnEdit({ id: id, nama: nama })
                employee.setAbsentCodeForm({ kode_absensi: row.original.kode_absensi })
                modal.setShowAbsen(true);
              }}><i className="bi bi-fingerprint"></i>
            </Button>

            <Button type='button' variant='success'
              onClick={() =>
                router.push(`karyawan/${id}/edit`)
              }>
              <i className="bi bi-pencil-fill"></i>
            </Button>

            <Button type='button' variant='warning' className='text-white'
              onClick={() => {
                employee.setOnEdit({ id: id, nama: nama })
                employee.setSpForm({ sp: row.original.sp })
                modal.setShowSp(true);
              }}>
              SP
            </Button>

            <Button type="button" variant='danger'
              onClick={() =>
                employee.onDelete(id, nama)
              }>
              <i className="bi bi-trash-fill"></i>
            </Button>
          </Stack>
        )
      }
    }
  ]