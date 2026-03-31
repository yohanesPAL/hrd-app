"use client";
import DefaultTable from '@/components/Table/DefaulteTable'
import { BaseEmployeeContrat, EmployeeContractForm, EmployeeContractTable } from '@/modules/employee/contract/employee.contract.schema';
import { Button } from 'react-bootstrap'
import { karyawanContractColumns } from '../../columns/KaryawanContractColumn';
import ContractAddForm from './ContractAddForm';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useExecuteAction } from '@/hooks/useExecuteAction';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { useShallow } from 'zustand/shallow';
import { createKaryawanContractAction, deleteKaryawanContractAction, updateKaryawanContractAction } from '../ContractAction';

const contractDefaultSort = [{ id: "no", desc: true }]
const contractFormDefault: EmployeeContractForm = {
  tgl_kontrak: new Date(),
  tgl_berakhir: null,
  jenis: "kontrak",
  total_kontrak: 0,
  karyawan_id: "",
}

const ContractsTable = ({ contracts }: { contracts: EmployeeContractTable[] }) => {
  const params = useParams();

  const {
    setOpen: openConfirmDelete,
    isPosting,
  } = useConfirmDelete(
    useShallow((state) => ({
      setOpen: state.setOpen,
      isPosting: state.isPosting,
    }))
  )

  const [showModal, setShowModal] = useState<boolean>(false);
  const [contractOnEdit, setContractOnEdit] = useState<string>("");
  const [contractForm, setContractForm] = useState<EmployeeContractForm>(contractFormDefault)
  const { executeAction, isSuspense } = useExecuteAction();

  const onCloseModal = () => {
    setShowModal(false);
    setContractOnEdit("");
    setContractForm(contractFormDefault);
  }

  const onEditContract = (id: string, data: EmployeeContractForm) => {
    setContractOnEdit(id);
    setContractForm(data);
    setShowModal(true);
  }

  const postContract = async (data: EmployeeContractForm) => {
    await toast.promise(
      executeAction(createKaryawanContractAction, { ...data, karyawan_id: params.id as string }), {
      pending: "Membuat kontrak...",
      success: "Berhasil buat kontrak",
      error: "Ooops... ada yang salah",
    })
  }

  const patchContract = async (id: BaseEmployeeContrat["id"], data: EmployeeContractForm) => {
    await toast.promise(
      executeAction(updateKaryawanContractAction, id, data), {
      pending: "Update kontrak...",
      success: "Berhasil update kontrak",
      error: "Ooops... ada yang salah",
    })
  }

  const onSubmit = async (payload: EmployeeContractForm) => {
    if (!payload) return toast.error("data tidak boleh kosong");

    if (contractOnEdit === "") {
      await postContract(payload);
    } else {
      await patchContract(contractOnEdit, payload);
    }

    onCloseModal();
  }

  const onDelete = async (id: BaseEmployeeContrat["id"]) => {
    if (!id) return toast.error("id tidak boleh kosong");

    await toast.promise(
      executeAction(deleteKaryawanContractAction, id), {
      pending: "Menghapus kontrak...",
      success: "Berhasil menghapus kontrak",
      error: "Ooops... ada yang salah",
    }
    )
  }

  return (
    <>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h3>Table Kontrak</h3>
        <Button type='button' variant='primary' onClick={() => setShowModal(true)}>
          <i className='bi bi-plus-lg'></i>
          <span>Tambah</span>
        </Button>
      </div>

      <DefaultTable<EmployeeContractTable>
        data={contracts ?? []}
        columns={karyawanContractColumns({
          onEditContract,
          openConfirmDelete,
          onDelete,
        })}
        defaultSort={contractDefaultSort}
        loading={isSuspense}
      />

      <ContractAddForm
        showModal={showModal}
        onCloseModal={onCloseModal}
        contractOnEdit={contractOnEdit}
        contractForm={contractForm}
        setContractForm={setContractForm}
        isPosting={isPosting}
        onSubmit={onSubmit}
      />
    </>
  )
}

export default ContractsTable