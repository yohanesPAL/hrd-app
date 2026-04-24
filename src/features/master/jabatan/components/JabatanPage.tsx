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
import { BasePosition, PositionForm, PositionTable } from '@/modules/master/jabatan/jabatan.schema';
import { DivisionTable } from '@/modules/master/divisi/division.schema';
import { useExecuteAction } from '@/hooks/useExecuteAction';
import { createPositionAction, deletePositionAction, updatePositionAction } from '../jabatanAction';
import { jabatanColumns } from '../columns/JabatanColumns';
import JabatanFormModal from './JabatanFormModal';
import { useActionHandler } from '@/hooks/useActionHandler';

const defaultSort: SortingState = [{ id: "no", desc: false }];
const defaultJabatanForm: PositionForm = { id_divisi: "", nama: "", is_active: 1 };

const JabatanPage = ({ data, divisiList }: { data: PositionTable[], divisiList: DivisionTable[] }) => {
  const { openConfirmDelete } = useConfirmDelete();
  const { run, isPending } = useActionHandler();

  const [table, setTable] = useState<Table<PositionTable> | null>(null);
  const [jabatanForm, setJabatanForm] = useState<PositionForm>(defaultJabatanForm);
  const [jabatanOnEdit, setJabatanOnEdit] = useState<BasePosition["id"]>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const onModalClosed = () => {
    setShowModal(false);
    setJabatanForm(defaultJabatanForm);
    setJabatanOnEdit("");
  }

  const onEdit = (data: PositionForm, id: BasePosition["id"]) => {
    setJabatanForm(data);
    setJabatanOnEdit(id);
    setShowModal(true);
  }

  const createJabatan = async () => {
    await run(createPositionAction, [jabatanForm], {
      toast: {
        pending: "Menambah jabatan...",
        success: "Berhasil menambah jabatan",
        error: "Ooops... ada yang salah",
      },
      refresh: true,
    })
  }

  const updateJabatan = async () => {
    await run(updatePositionAction, [jabatanForm, jabatanOnEdit], {
      toast: {
        pending: "Update jabatan...",
        success: "Berhasil update jabatan",
        error: "Ooops... ada yang salah",
      },
      refresh: true
    })
  }

  const onSubmit = async () => {
    if (jabatanOnEdit === "") await createJabatan();
    else await updateJabatan();

    onModalClosed();
  }

  const onDelete = async (id: string) => {
    if (!id) return toast.error("id tidak boleh kosong!");

    await run(deletePositionAction, [id], {
      toast: {
        pending: "Menghapus jabatan...",
        success: "Berhasil menghapus jabatan!",
        error: "Ooops... ada yang salah",
      },
      refresh: true,
    })
  }

  const onExport = () => {
    if (!table) return toast.error("Table tidak ditemukan");
    exportTableToExcel<PositionTable>(table, "Jabatan")
  }

  return (
    <>
      <Stack direction='horizontal' gap={2}>
        <Button type='button' variant='primary' onClick={() => setShowModal(true)} disabled={divisiList.length > 0 && false}>
          <i className='bi bi-briefcase-fill'></i>
          <span style={{ marginLeft: "4px" }}>Tambah</span>
        </Button>
        <ExportToExcel onExport={onExport} />
      </Stack>

      <DefaultTable<PositionTable>
        loading={isPending}
        data={data ?? []}
        columns={jabatanColumns({
          onEdit,
          onDelete: (id, nama) => openConfirmDelete({ id, nama }, (id) => onDelete(id)),   
        })}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
      />

      <JabatanFormModal
        modal={{ show: showModal, onClosed: onModalClosed }}
        jabatan={{ onSubmit, form: jabatanForm, setForm: setJabatanForm, onEdit: jabatanOnEdit }}
        divisiList={divisiList}
        isPending={isPending}
      />
    </>
  )
}

export default JabatanPage