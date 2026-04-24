"use client";
import ExportToExcel from '@/components/Buttons/ExportToExcel'
import DefaultTable from '@/components/Table/DefaulteTable'
import { exportTableToExcel } from '@/utils/exportTableToExcel'
import { SortingState, Table } from '@tanstack/react-table'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation';
import { Button, Stack, } from 'react-bootstrap';
import useProfile from '@/stores/profile/profile.store';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { karyawanColumns } from '../columns/KaryawanColumns';
import { BaseEmployee, EmployeeKodeAbsenForm, EmployeeSpForm, EmployeeTable } from '@/modules/employee/employee.schema';
import KaryawanSpModal from './KaryawanSpModal';
import KaryawanKodeAbsenModal from './KaryawanKodeAbsenModal';
import { deleteKaryawanAction, updateKaryawanKodeAbsenAction, updateKaryawanSpAction } from '../KaryawanAction';
import { KaryawanOnEdit } from '../types/KaryawanTypes';
import { useActionHandler } from '@/hooks/useActionHandler';

const defaultSort: SortingState = [{ id: 'no', desc: false }]
const kodeAbsenFormDefault: EmployeeKodeAbsenForm = { kode_absensi: null }
const spFormDefault: EmployeeSpForm = { sp: 0 }
const karyawanOnEditDefault: KaryawanOnEdit = { nama: "", id: "" }

const KaryawanPage = ({ data }: { data: EmployeeTable[] }) => {
  const router = useRouter()
  const role = useProfile((state) => state.profile?.role)

  const { openConfirmDelete } = useConfirmDelete();
  const { run, isPending } = useActionHandler();

  const [table, setTable] = useState<Table<EmployeeTable> | null>(null)
  const [showModalAbsen, setShowModalAbsen] = useState<boolean>(false)
  const [showModalSp, setShowModalSp] = useState<boolean>(false)
  const [absentCodeForm, setAbsenCodeForm] = useState<EmployeeKodeAbsenForm>(kodeAbsenFormDefault)
  const [spForm, setSpForm] = useState<EmployeeSpForm>(spFormDefault)
  const [employeeOnEdit, setKaryawanOnEdit] = useState<KaryawanOnEdit>(karyawanOnEditDefault);

  const onAbsentModalClosed = () => {
    setShowModalAbsen(false)
    setKaryawanOnEdit(karyawanOnEditDefault)
    setAbsenCodeForm(kodeAbsenFormDefault)
  }

  const onSpModalClosed = () => {
    setShowModalSp(false)
    setKaryawanOnEdit(karyawanOnEditDefault)
    setSpForm(spFormDefault)
  }

  const updateEmployeeAbsentCode = async () => {
    try {
      await run(updateKaryawanKodeAbsenAction, [employeeOnEdit.id, absentCodeForm], {
        toast: {
          pending: "Update kode absen...",
          success: "Berhasil update kode absen",
          error: "Ooops... ada yang salah"
        },
        refresh: true
      })
    } finally {
      onAbsentModalClosed();

    }
  }

  const updateEmployeeSp = async () => {
    if (spForm.sp > 3) return toast.error("sp tidak boleh > 3");

    try {
      await run(updateKaryawanSpAction, [employeeOnEdit.id, spForm], {
        toast: {
          pending: "Update SP...",
          success: "Berhasil update SP",
          error: "Ooops... ada yang salah"
        }, refresh: true
      })
    } finally {
      onSpModalClosed();
    }

  }

  const deleteEmployee = async (id: BaseEmployee["id"]) => {
    if (!id) return toast.error("id karyawan tidak boleh kosong");

    await run(deleteKaryawanAction, [id], {
      toast: {
        pending: "Menghapus karyawan...",
        success: "Berhasil hapus karyawan",
        error: "Ooops... ada yang salah"
      }, refresh: true,
    })
  }

  const onExport = () => {
    if (!table) return toast.error("Table tidak ditemukan");
    exportTableToExcel<EmployeeTable>(table, "Karyawan");
  }

  return (
    <>
      <Stack direction='horizontal' gap={2}>
        <Button type='button' variant='primary' onClick={() => router.push(`/${role}/karyawan/tambah`)}>
          <i className='bi bi-person-fill'></i>
          <span style={{ marginLeft: "4px" }}>Tambah</span>
        </Button>
        <ExportToExcel onExport={onExport} />
      </Stack>
      <DefaultTable<EmployeeTable>
        data={data ?? []}
        columns={karyawanColumns({
          role,
          router,
          employee: {
            setOnEdit: setKaryawanOnEdit,
            setAbsentCodeForm: setAbsenCodeForm,
            setSpForm,
            onDelete: (id, nama) => openConfirmDelete({ id, nama }, (id) => deleteEmployee(id)),
          },
          modal: {
            setShowAbsen: setShowModalAbsen,
            setShowSp: setShowModalSp,
          }
        })}
        defaultSort={defaultSort}
        loading={isPending}
        tableWidth='115%'
        SetTableComponent={setTable}
      />

      <KaryawanKodeAbsenModal
        modal={{ show: showModalAbsen, onClosed: onAbsentModalClosed }}
        absentCode={{
          onUpdate: updateEmployeeAbsentCode,
          form: absentCodeForm,
          setForm: setAbsenCodeForm
        }}
        employeeOnEdit={employeeOnEdit}
        isPending
      />

      <KaryawanSpModal
        modal={{ show: showModalSp, onClosed: onSpModalClosed }}
        sp={{ onUpdate: updateEmployeeSp, form: spForm, setForm: setSpForm }}
        employeeOnEdit={employeeOnEdit}
        isPending
      />
    </>
  )
}

export default KaryawanPage