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
import { useShallow } from 'zustand/shallow';
import { useExecuteAction } from '@/hooks/useExecuteAction';
import { karyawanColumns } from '../columns/KaryawanColumns';
import { EmployeeKodeAbsenForm, EmployeeSpForm, EmployeeTable } from '@/modules/employee/employee.schema';
import KaryawanSpModal from './KaryawanSpModal';
import KaryawanKodeAbsenModal from './KaryawanKodeAbsenModal';
import { deleteKaryawan, updateKaryawanKodeAbsen, updateKaryawanSP } from '../KaryawanAction';
import { KaryawanOnEdit } from '../types/KaryawanTypes';

const defaultSort: SortingState = [{ id: 'no', desc: false }]
const kodeAbsenFormDefault: EmployeeKodeAbsenForm = { kode_absensi: null }
const spFormDefault: EmployeeSpForm = { sp: 0 }
const karyawanOnEditDefault: KaryawanOnEdit = { nama: "", id: "" }

const KaryawanPage = ({ data }: { data: EmployeeTable[] }) => {
  const router = useRouter()
  const role = useProfile((state) => state.profile?.role)

  const {
    setOpen: openConfirmDelete,
    isPosting,
  } = useConfirmDelete(
    useShallow((state) => ({
      setOpen: state.setOpen,
      isPosting: state.isPosting,
    }))
  )

  const [table, setTable] = useState<Table<EmployeeTable> | null>(null)
  const [showModalAbsen, setShowModalAbsen] = useState<boolean>(false)
  const [kodeAbsenForm, setKodeAbsenForm] = useState<EmployeeKodeAbsenForm>(kodeAbsenFormDefault)
  const [showModalSp, setShowModalSp] = useState<boolean>(false)
  const [spForm, setSpForm] = useState<EmployeeSpForm>(spFormDefault)
  const [karyawanOnEdit, setKaryawanOnEdit] = useState<KaryawanOnEdit>(karyawanOnEditDefault);
  const { executeAction, isSuspense } = useExecuteAction()

  const onCloseModalAbsen = () => {
    setShowModalAbsen(false)
    setKaryawanOnEdit(karyawanOnEditDefault)
    setKodeAbsenForm(kodeAbsenFormDefault)
  }

  const onCloseModalSp = () => {
    setShowModalSp(false)
    setKaryawanOnEdit(karyawanOnEditDefault)
    setSpForm(spFormDefault)
  }

  const onUpdateKodeAbsen = async (payload: EmployeeKodeAbsenForm) => {
    if (!payload) return toast.error("data tidak boleh kosong");

    await toast.promise(
      executeAction(updateKaryawanKodeAbsen, karyawanOnEdit.id, payload), {
      pending: "Update kode absen...",
      success: "Berhasil update kode absen",
      error: "Ooops... ada yang salah"
    })

    onCloseModalAbsen();
  }

  const onUpdateSp = async (payload: EmployeeSpForm) => {
    if (!payload) return toast.error("data tidak boleh kosong");
    if (payload.sp > 3) return toast.error("sp tidak boleh > 3");

    await toast.promise(
      executeAction(updateKaryawanSP, karyawanOnEdit.id, payload), {
      pending: "Update SP...",
      success: "Berhasil update SP",
      error: "Ooops... ada yang salah"
    })

    onCloseModalSp();
  }

  const onDelete = async (kode: string) => {
    if (!kode) return toast.error("id tidak boleh kosong!")

    await toast.promise(
      executeAction(deleteKaryawan, kode), {
      pending: "Menghapus karyawan...",
      success: "Berhasil hapus karyawan",
      error: "Ooops... ada yang salah"
    }
    )
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
          <span style={{marginLeft: "4px"}}>Tambah</span>
        </Button>
        <ExportToExcel onExport={onExport} />
      </Stack>
      <DefaultTable<EmployeeTable>
        data={data ?? []}
        columns={karyawanColumns({
          role,
          router,
          setKaryawanOnEdit,
          setKodeAbsenForm,
          setShowModalAbsen,
          setShowModalSp,
          setSpForm,
          openConfirmDelete,
          onDelete,
        })}
        defaultSort={defaultSort}
        loading={isSuspense}
        tableWidth='115%'
        SetTableComponent={setTable}
      />

      <KaryawanKodeAbsenModal
        showModalAbsen={showModalAbsen}
        onCloseModalAbsen={onCloseModalAbsen}
        onUpdateKodeAbsen={onUpdateKodeAbsen}
        karyawanOnEdit={karyawanOnEdit}
        kodeAbsenForm={kodeAbsenForm}
        setKodeAbsenForm={setKodeAbsenForm}
        isPosting={isPosting}
      />

      <KaryawanSpModal
        showModalSp={showModalSp}
        onCloseModalSp={onCloseModalSp}
        onUpdateSp={onUpdateSp}
        karyawanOnEdit={karyawanOnEdit}
        spForm={spForm}
        setSpForm={setSpForm}
        isPosting={isPosting}
      />
    </>
  )
}

export default KaryawanPage