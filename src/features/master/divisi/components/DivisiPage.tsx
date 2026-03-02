'use client';
import DefaultTable from '@/components/Table/DefaulteTable';
import { SortingState, Table } from '@tanstack/react-table';
import { useState } from 'react'
import { Button, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ExportToExcel from '@/components/Buttons/ExportToExcel';
import { exportTableToExcel } from '@/utils/exportTableToExcel';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { useShallow } from 'zustand/shallow';
import { divisiColumns } from '../columns/DivisiColumns';
import DivisiFormModal from './DivisiFormModal';
import { DivisionForm, DivisionTable } from '@/modules/master/divisi/division.schema';
import { createDivisionAction, deleteDivisionAction, updateDivisionAction } from '../divisiAction';
import { useExecuteAction } from '@/hooks/useExecuteAction';

const defaultDivisiForm: DivisionForm = { nama: "", is_active: true, id: undefined }
const defaultSort: SortingState = [{ id: "no", desc: false }]

const DivisiPage = ({ data }: { data: DivisionTable[] }) => {
  const {
    setOpen: openConfirmDelete,
    isPosting,
  } = useConfirmDelete(
    useShallow((state) => ({
      setOpen: state.setOpen,
      isPosting: state.isPosting,
    }))
  )

  const [table, setTable] = useState<Table<DivisionTable> | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [divisiForm, setDivisiForm] = useState<DivisionForm>(defaultDivisiForm)
  const { executeAction, isSuspense } = useExecuteAction();

  const onCloseModal = () => {
    setShow(false);
    setDivisiForm(defaultDivisiForm);
  }

  const onSubmit = async (payload: DivisionForm) => {
    if (!payload) return toast.error("data divisi tidak boleh kosong")

    if (!divisiForm.id) {
      await toast.promise(
        executeAction(createDivisionAction, payload), {
        pending: "Membuat divisi...",
        success: "Berhasil buat divisi",
        error: "Ooops... ada yang salah",
      })
    } else {
      if (!payload.id) return toast.error("id tidak boleh kosong")
      const normalized = {...payload, id: payload.id}
      await toast.promise(
        executeAction(updateDivisionAction, normalized), {
        pending: "Update divisi...",
        success: "Berhasil update divisi!",
        error: "Ooops... ada yang salah",
      })
    }

    onCloseModal();
  }

  const onDelete = async (kode: string) => {
    if (!kode) return toast.error("kode tidak boleh kosong");

    await toast.promise(
      executeAction(deleteDivisionAction, kode), {
      pending: "Menghapus divisi...",
      success: "Berhasil menghapus divisi!",
      error: "Ooops... ada yang salah",
    })
  }

  const onExport = () => {
    if (!table) return toast.error("Table tidak ditemukan");
    exportTableToExcel<DivisionTable>(table, "Divisi");
  }

  return (
    <>
      <Stack direction='horizontal' gap={2}>
        <Button type='button' variant='primary' onClick={() => setShow(true)}>
          <i className='bi bi-stack'></i>
          <span>Tambah</span>
        </Button>
        <ExportToExcel onExport={onExport} />
      </Stack>

      <DefaultTable<DivisionTable>
        data={data ?? []}
        columns={divisiColumns({
          setDivisiForm,
          setShow,
          openConfirmDelete,
          onDelete,
        })}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
        loading={isSuspense}
      />

      <DivisiFormModal
        show={show}
        isPosting={isPosting}
        divisiForm={divisiForm}
        setDivisiForm={setDivisiForm}
        onCloseModal={onCloseModal}
        onSubmit={onSubmit}
      />
    </>
  )
}

export default DivisiPage