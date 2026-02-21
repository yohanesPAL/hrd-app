'use client';
import DefaultTable from '@/components/Table/DefaulteTable';
import { SortingState, Table } from '@tanstack/react-table';
import { useState, useTransition } from 'react'
import { Button, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ExportToExcel from '@/components/Buttons/ExportToExcel';
import { exportTableToExcel } from '@/utils/exportTableToExcel';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { useShallow } from 'zustand/shallow';
import { divisiColumns } from '../columns/DivisiColumns';
import DivisiFormModal from './DivisiFormModal';
import { DivisionForm, DivisionTable } from '@/modules/divisi/division.schema';
import { createDivisionAction, deleteDivisionAction, updateDivisionAction } from '../divisiAction';

const defaultDivisiForm: DivisionForm = { nama: "", is_active: true }
const defaultSort: SortingState = [{ id: "no", desc: false }]

const DivisiPage = ({ data }: { data: DivisionTable[] }) => {
  const router = useRouter()

  const {
    setOpen: openConfirmDelete,
    setClose: closeConfirmDelete,
    isPosting,
    setIsPosting,
  } = useConfirmDelete(
    useShallow((state) => ({
      setOpen: state.setOpen,
      setClose: state.setClose,
      isPosting: state.isPosting,
      setIsPosting: state.setIsPosting,
    }))
  )

  const [table, setTable] = useState<Table<DivisionTable> | null>(null);
  const [editingId, setEditingId] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [divisiForm, setDivisiForm] = useState<DivisionForm>(defaultDivisiForm)
  const [isPending, startTransition] = useTransition()

  const onCloseModal = () => {
    setShow(false);
    setDivisiForm(defaultDivisiForm);
    setEditingId("");
  }

  const onSubmit = async (payload: DivisionForm) => {
    if (!payload) return toast.error("data divisi tidak boleh kosong")

    setIsPosting(true);

    if (editingId === "") {
      await toast.promise(
        createDivisionAction(payload), {
        pending: "Membuat divisi...",
        success: "Berhasil buat divisi",
        error: "Ooops... ada yang salah",
      })
    } else {
      await toast.promise(
        updateDivisionAction({ ...payload, id: editingId }), {
        pending: "Update divisi...",
        success: "Berhasil update divisi!",
        error: "Ooops... ada yang salah",
      })
    }

    startTransition(() => router.refresh());
    setIsPosting(false);
    onCloseModal();
  }

  const onDelete = async (kode: string) => {
    if (!kode) return toast.error("kode tidak boleh kosong");

    await toast.promise(
      deleteDivisionAction(kode), {
      pending: "Menghapus divisi...",
      success: "Berhasil menghapus divisi!",
      error: "Ooops... ada yang salah",
    })

    closeConfirmDelete();
    startTransition(() => router.refresh());
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
          setEditingId,
          setDivisiForm,
          setShow,
          openConfirmDelete,
          onDelete,
        })}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
        loading={isPending}
      />

      <DivisiFormModal
        show={show}
        isPosting={isPosting}
        editingId={editingId}
        divisiForm={divisiForm}
        setDivisiForm={setDivisiForm}
        onCloseModal={onCloseModal}
        onSubmit={onSubmit}
      />
    </>
  )
}

export default DivisiPage