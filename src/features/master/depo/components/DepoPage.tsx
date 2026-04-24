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
import { useActionHandler } from "@/hooks/useActionHandler";

const defaultSort: SortingState = [{ id: "no", desc: false }];
const depoFormDefault: DepoForm = {
  nama: ""
}

const DepoPage = ({ depoData }: { depoData: DepoTable[] }) => {
  const { openConfirmDelete } = useConfirmDelete();
  const { run, isPending } = useActionHandler();

  const [depoForm, setDepoForm] = useState<DepoForm>(depoFormDefault);
  const [depoOnEdit, setDepoOnEdit] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const onModalClose = () => {
    setDepoForm(depoFormDefault);
    setShowModal(false);
    setDepoOnEdit("");
  }

  const createDepo = async () => {
    await run(createDepoAction, [depoForm], {
      toast: {
        pending: "Membuat depo...",
        success: "Berhasil buat depo",
        error: "Ooops... ada yang salah",
      },
      refresh: true
    })
  }

  const updateDepo = async () => {
    await run(updateDepoAction, [depoForm, depoOnEdit], {
      toast: {
        pending: "Update depo...",
        success: "Berhasil update depo",
        error: "Ooops... ada yang salah",
      },
      refresh: true
    })
  }

  const onSubmit = async () => {
    if (depoOnEdit === "") await createDepo();
    else await updateDepo();

    onModalClose();
  }

  const onDelete = async (id: BaseDepo["id"]) => {
    await run(deleteDepoAction, [id], {
      toast: {
        pending: "Menghapus depo...",
        success: "Berhasil hapus depo",
        error: "Ooops... ada yang salah",
      },
      refresh: true
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
          isPosting: isPending,
        })}
        data={depoData}
        defaultSort={defaultSort}
        loading={isPending}
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
            <Button type="submit" variant="primary" disabled={isPending}>Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default DepoPage