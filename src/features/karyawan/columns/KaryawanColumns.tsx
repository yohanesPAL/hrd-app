import { EmployeeKodeAbsenForm, EmployeeSpForm, EmployeeTable } from "@/modules/employee/employee.schema"
import { ConfirmDeleteProps } from "@/stores/confirmDelete/confirmDelete.type"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Dispatch, SetStateAction } from "react"
import { Button, Stack } from "react-bootstrap"
import { KaryawanOnEdit } from "../types/KaryawanTypes"

export const karyawanColumns = ({
  role,
  router,
  setKaryawanOnEdit,
  setKodeAbsenForm,
  setShowModalAbsen,
  setSpForm,
  setShowModalSp,
  openConfirmDelete,
  onDelete,
}: {
  role: string | undefined,
  router: any,
  setKaryawanOnEdit: Dispatch<SetStateAction<KaryawanOnEdit>>,
  setKodeAbsenForm: Dispatch<SetStateAction<EmployeeKodeAbsenForm>>,
  setShowModalAbsen: Dispatch<SetStateAction<boolean>>,
  setSpForm: Dispatch<SetStateAction<EmployeeSpForm>>,
  setShowModalSp: Dispatch<SetStateAction<boolean>>,
  openConfirmDelete: (props: ConfirmDeleteProps, onConfirm: (id: string) => void) => void,
  onDelete: (id: string) => void,
}): ColumnDef<EmployeeTable>[] => [
    { accessorKey: "no", header: "No", sortingFn: "alphanumeric" },
    {
      accessorKey: "nama", header: "Nama", cell: ({ row }) => {
        return (
          <Link href={`/${role}/profile/${row.original.id}`}>
            <Button type='button' variant='success' className='px-2 py-1'>{row.original.nama}</Button>
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
      }
    },
    { accessorKey: "kode_absensi", header: "Kode Absen" },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => {
        const kode = row.original.id
        const nama = row.original.nama
        return (
          <Stack direction='horizontal' gap={2}>
            <Button type='button' onClick={() => {
              setKaryawanOnEdit({id: kode, nama: nama})
              setKodeAbsenForm({ kode_absensi: row.original.kode_absensi })
              setShowModalAbsen(true);
            }}><i className="bi bi-fingerprint"></i></Button>
            <Button type='button' variant='success' onClick={() => router.push(`karyawan/${kode}/edit`)}><i className="bi bi-pencil-fill"></i></Button>
            <Button type='button' variant='warning' className='text-white' onClick={() => {
              setKaryawanOnEdit({id: kode, nama: nama})
              setSpForm({ sp: row.original.sp })
              setShowModalSp(true);
            }}>SP</Button>
            <Button type="button" variant='danger' onClick={() => openConfirmDelete({ nama: nama, id: kode }, (id: string) => onDelete(id))}><i className="bi bi-trash-fill"></i></Button>
          </Stack>
        )
      }
    }
  ]