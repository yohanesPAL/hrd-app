"use client";
import DefaultTable from '@/components/Table/DefaulteTable'
import { BaseEmployeeContract, EmployeeContractForm, EmployeeContractTable } from '@/modules/employee/contract/employee.contract.schema';
import { Button } from 'react-bootstrap'
import { karyawanContractColumns } from '../../columns/KaryawanContractColumn';
import ContractAddForm from './ContractAddForm';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { createKaryawanContractAction, deleteKaryawanContractAction, updateKaryawanContractAction } from '../ContractAction';
import { useActionHandler } from '@/hooks/useActionHandler';

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

  const { openConfirmDelete } = useConfirmDelete();
  const { run, isPending } = useActionHandler();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [contractOnEdit, setContractOnEdit] = useState<string>("");
  const [contractForm, setContractForm] = useState<EmployeeContractForm>(contractFormDefault)

  const onModalClosed = () => {
    setShowModal(false);
    setContractOnEdit("");
    setContractForm(contractFormDefault);
  }

  const onEditContract = (id: string, data: EmployeeContractForm) => {
    setContractOnEdit(id);
    setContractForm(data);
    setShowModal(true);
  }

  const createContract = async () => {
    await run(createKaryawanContractAction, [{ ...contractForm, karyawan_id: params.id as string }], {
      toast: {
        pending: "Membuat kontrak...",
        success: "Berhasil buat kontrak",
        error: {
          render: ({ data: err }: { data: any }) => err?.message || "Ooops... ada yang salah",
        },
      },
      refresh: true,
    })
  }

  const updateContract = async () => {
    await run(updateKaryawanContractAction, [contractOnEdit, contractForm], {
      toast: {
        pending: "Update kontrak...",
        success: "Berhasil update kontrak",
        error: {
          render: ({ data: err }: { data: any }) => err?.message || "Ooops... ada yang salah",
        }
      },
      refresh: true
    })
  }

  const onSubmit = async () => {
    try {
      if (contractOnEdit === "") await createContract();
      else await updateContract();
    } finally {
      onModalClosed();
    }
  }

  const onDelete = async (id: BaseEmployeeContract["id"]) => {
    if (!id) return toast.error("id tidak boleh kosong");

    await run(deleteKaryawanContractAction, [id], {
      toast: {
        pending: "Menghapus kontrak...",
        success: "Berhasil menghapus kontrak",
        error: "Ooops... ada yang salah",
      },
      refresh: true,
    })
  }

  return (
    <>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h3>Table Kontrak</h3>
        <Button type='button' variant='primary' onClick={() => setShowModal(true)}>
          <i className='bi bi-plus-lg'></i>
          <span style={{ marginLeft: "4px" }}>Tambah</span>
        </Button>
      </div>

      <DefaultTable<EmployeeContractTable>
        data={contracts ?? []}
        columns={karyawanContractColumns({
          onEditContract,
          onDelete: (id, nama) => openConfirmDelete({ id, nama }, (id) => onDelete(id)),
        })}
        defaultSort={contractDefaultSort}
        loading={isPending}
      />

      <ContractAddForm
        modal={{ show: showModal, onClose: onModalClosed }}
        contract={{
          onEdit: contractOnEdit,
          form: contractForm,
          setForm: setContractForm,
          onSubmit: onSubmit,
        }}
        isPending
      />
    </>
  )
}

export default ContractsTable