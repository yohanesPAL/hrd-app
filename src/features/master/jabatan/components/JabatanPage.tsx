'use client';
import DefaultTable from '@/components/Table/DefaulteTable';
import { ColumnDef, SortingState, Table } from '@tanstack/react-table';
import { FormEvent, useEffect, useMemo, useState, useTransition } from 'react'
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ExportToExcel from '@/components/Buttons/ExportToExcel';
import { exportTableToExcel } from '@/utils/exportTableToExcel';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { useShallow } from 'zustand/shallow';
import { PositionForm, PositionTable } from '@/modules/jabatan/jabatan.schema';
import { DivisionTable } from '@/modules/divisi/division.schema';
import { useExecuteAction } from '@/hooks/useExecuteAction';
import { createPositionAction, deletePositionAction, updatePositionAction } from '../jabatanAction';
import { jabatanColumns } from '../columns/JabatanColumns';
import JabatanFormModal from './JabatanFormModal';

const defaultSort: SortingState = [{ id: "no", desc: false }];
const defaultJabatanForm: PositionForm = { id: undefined, id_divisi: "", nama: "", is_active: true };

const JabatanPage = ({ data, divisiList }: { data: PositionTable[], divisiList: DivisionTable[] }) => {

  const {
    setOpen: openConfirmDelete,
    isPosting,
  } = useConfirmDelete(
    useShallow((state) => ({
      setOpen: state.setOpen,
      isPosting: state.isPosting,
    }))
  )

  const [table, setTable] = useState<Table<PositionTable> | null>(null);
  const [jabatanForm, setJabatanForm] = useState<PositionForm>(defaultJabatanForm)
  const [show, setShow] = useState<boolean>(false);
  const { executeAction, isSuspense } = useExecuteAction();

  const onCloseModal = () => {
    setShow(false);
    setJabatanForm(defaultJabatanForm);
  }

  const onSubmit = async (payload: PositionForm) => {
    if (!payload) return toast.error("data jabatan tidak boleh kosong");

    if (!jabatanForm.id) {
      await toast.promise(
        executeAction(createPositionAction, payload), {
        pending: "Menambah jabatan...",
        success: "Berhasil menambah jabatan!",
        error: "Ooops... ada yang salah",
      })
    } else {
      if (!payload.id) return toast.error("id tidak boleh kosong")
      const normalized = { ...payload, id: payload.id }
      await toast.promise(
        executeAction(updatePositionAction, normalized), {
        pending: "Update jabatan...",
        success: "Berhasil update jabatan!",
        error: "Ooops... ada yang salah",
      })
    }

    onCloseModal();
  }

  const onDelete = async (kode: string) => {
    if (!kode) return toast.error("id tidak boleh kosong!");

    await toast.promise(
      executeAction(deletePositionAction, kode), {
      pending: "Menghapus jabatan...",
      success: "Berhasil menghapus jabatan!",
      error: "Ooops... ada yang salah",
    })
  }

  const onExport = () => {
    if (!table) return toast.error("Table tidak ditemukan");
    exportTableToExcel<PositionTable>(table, "Jabatan")
  }

  return (
    <>
      <Stack direction='horizontal' gap={2}>
        <Button type='button' variant='primary' onClick={() => setShow(true)} disabled={divisiList.length > 0 && false}>
          <i className='bi bi-briefcase-fill'></i>
          <span>Tambah</span>
        </Button>
        <ExportToExcel onExport={onExport} />
      </Stack>

      <DefaultTable<PositionTable>
        loading={isSuspense}
        data={data ?? []}
        columns={jabatanColumns({
          setJabatanForm,
          setShow,
          openConfirmDelete,
          onDelete,
        })}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
      />

      <JabatanFormModal
        show={show}
        isPosting={isPosting}
        onCloseModal={onCloseModal}
        onSubmit={onSubmit}
        jabatanForm={jabatanForm}
        setJabatanForm={setJabatanForm}
        divisiList={divisiList}
      />
    </>
  )
}

export default JabatanPage