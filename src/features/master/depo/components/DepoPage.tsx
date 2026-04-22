"use client"

import DefaultTable from "@/components/Table/DefaulteTable";
import { BaseDepo, DepoForm, DepoTable } from "@/modules/depo/depo.schema";
import { depoColumns } from "../columns/DepoColumns";
import { SortingState } from "@tanstack/react-table";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import useConfirmDelete from "@/stores/confirmDelete/confirmDelete.store";
import { useShallow } from "zustand/shallow";
import { useExecuteAction } from "@/hooks/useExecuteAction";
import { toast } from "react-toastify";
import { createDepoAction, deleteDepoAction, updateDepoAction } from "../DepoActions";

const defaultSort: SortingState = [{ id: "no", desc: false }];
const depoFormDefault: DepoForm = {
  nama: ""
}

const DepoPage = ({ depoData }: { depoData: DepoTable[] }) => {
  const { setOpen: openConfirmDelete, isPosting } = useConfirmDelete(useShallow((state) => ({
    setOpen: state.setOpen,
    isPosting: state.isPosting,
  })));

  const [depoForm, setDepoForm] = useState<DepoForm>(depoFormDefault);
  const [depoOnEdit, setDepoOnEdit] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const { executeAction, isSuspense } = useExecuteAction();

  const onModalClose = () => {
    setDepoForm(depoFormDefault);
    setShowModal(false);
    setDepoOnEdit("");
  }

  const createDepo = async (data: DepoForm) => {
    await toast.promise(
      executeAction(createDepoAction, data), {
      pending: "Membuat depo...",
      success: "Berhasil buat depo",
      error: "Ooops... ada yang salah",
    })
  }

  const updateDepo = async (data: DepoForm, id: BaseDepo["id"]) => {
    await toast.promise(
      executeAction(updateDepoAction, data, id), {
      pending: "Update depo...",
      success: "Berhasil update depo",
      error: "Ooops... ada yang salah",
    })
  }

  const onSubmit = () => {
    if (depoOnEdit === "") {
      createDepo(depoForm);
    } else {
      updateDepo(depoForm, depoOnEdit);
    }

    onModalClose();
  }

  const onDelete = async (id: BaseDepo["id"]) => {
    await toast.promise(
      executeAction(deleteDepoAction, id), {
      pending: "Menghapus depo...",
      success: "Berhasil hapus depo",
      error: "Ooops... ada yang salah",
    })
  }

  return (
    <>
      <Button type='button' variant='primary' onClick={() => setShowModal(true)}>
        <i className='bi bi-building-fill'></i>
        <span style={{ marginLeft: "4px" }}>Tambah</span>
      </Button>

      <DefaultTable<DepoTable>
        columns={depoColumns({
          updateDepo: {
            setShowModal: setShowModal,
            setDepoForm: setDepoForm,
            setDepoOnEdit: setDepoOnEdit,
          },
          deleteDepo: {
            openConfirmDelete: openConfirmDelete,
            onDelete: onDelete,
          },
          isPosting: isPosting,
        })}
        data={depoData}
        defaultSort={defaultSort}
        loading={isSuspense}
      />

      <Modal show={showModal} onHide={onModalClose}>
        <Modal.Header>
          <Modal.Title>{depoOnEdit === "" ? "Tambah" : "Edit"} Depo</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="ex: Metro"
                value={depoForm.nama}
                onChange={(e) => setDepoForm(prev => ({ ...prev, nama: e.target.value }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="danger" onClick={onModalClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isPosting}>Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default DepoPage