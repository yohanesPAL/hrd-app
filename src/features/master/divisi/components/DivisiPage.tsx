'use client';
import DefaultTable from '@/components/Table/DefaulteTable';
import { SortingState, Table } from '@tanstack/react-table';
import { useState } from 'react'
import { Button, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ExportToExcel from '@/components/Buttons/ExportToExcel';
import { exportTableToExcel } from '@/utils/exportTableToExcel';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { divisiColumns } from '../columns/DivisiColumns';
import DivisiFormModal from './DivisiFormModal';
import { BaseDivision, DivisionForm, DivisionTable } from '@/modules/master/divisi/division.schema';
import { createDivisionAction, deleteDivisionAction, updateDivisionAction } from '../divisiAction';
import { useActionHandler } from '@/hooks/useActionHandler';

const defaultDivisiForm: DivisionForm = { nama: "", is_active: 1 }
const defaultSort: SortingState = [{ id: "no", desc: false }]

const DivisiPage = ({ data }: { data: DivisionTable[] }) => {
  const { openConfirmDelete } = useConfirmDelete()
  const { run, isPending } = useActionHandler();

  const [table, setTable] = useState<Table<DivisionTable> | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [divisiForm, setDivisiForm] = useState<DivisionForm>(defaultDivisiForm)
  const [divisiOnEdit, setDivisiOnEdit] = useState<BaseDivision["id"]>("");

  const onModalClosed = () => {
    setShowModal(false);
    setDivisiForm(defaultDivisiForm);
    setDivisiOnEdit("");
  }

  const onEdit = (data: DivisionForm, id: BaseDivision["id"]) => {
    setDivisiOnEdit(id);
    setDivisiForm(data);
    setShowModal(true);
  }

  const createDivision = async () => {
    await run(createDivisionAction, [divisiForm], {
      toast: {
        pending: "Membuat divisi...",
        success: "Berhasil buat divisi",
        error: "Ooops... ada yang salah",
      },
      refresh: true
    })
  }

  const updateDivision = async () => {
    await run(updateDivisionAction, [divisiForm, divisiOnEdit], {
      toast: {
        pending: "Membuat divisi...",
        success: "Berhasil buat divisi",
        error: "Ooops... ada yang salah",
      },
      refresh: true
    })
  }

  const onSubmit = async () => {
    if (divisiOnEdit === "") await createDivision();
    else await updateDivision();

    onModalClosed();
  }

  const onDelete = async (id: string) => {
    if (!id) return toast.error("kode tidak boleh kosong");

    await run(deleteDivisionAction, [id], {
      toast: {
        pending: "Menghapus divisi...",
        success: "Berhasil menghapus divisi!",
        error: "Ooops... ada yang salah",
      },
      refresh: true,
    })
  }

  const onExport = () => {
    if (!table) return toast.error("Table tidak ditemukan");
    exportTableToExcel<DivisionTable>(table, "Divisi");
  }

  return (
    <>
      <Stack direction='horizontal' gap={2}>
        <Button type='button' variant='primary' onClick={() => setShowModal(true)}>
          <i className='bi bi-stack'></i>
          <span style={{ marginLeft: "4px" }}>Tambah</span>
        </Button>
        <ExportToExcel onExport={onExport} />
      </Stack>

      <DefaultTable<DivisionTable>
        data={data ?? []}
        columns={divisiColumns({
          onEdit,
          onDelete: (id, nama) => openConfirmDelete({ id, nama }, (id) => onDelete(id)),
        })}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
        loading={isPending}
      />

      <DivisiFormModal
        modal={{ show: showModal, onClosed: onModalClosed }}
        divisi={{ form: divisiForm, setForm: setDivisiForm, onSubmit, onEdit: divisiOnEdit }}
        isPending={isPending}
      />
    </>
  )
}

export default DivisiPage