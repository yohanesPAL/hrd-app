"use client";
import DefaultTable from "@/components/Table/DefaulteTable";
import { BaseCarMaintenance, CarMaintenanceForm, CarMaintenanceTable } from "@/modules/car/maintenance/car.maintenance.schema";
import { SortingState } from "@tanstack/react-table";
import { kendaraanMaintenanceColumns } from "../columns/KendaraanMaintenanceColumns";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { useState } from "react";
import useConfirmDelete from "@/stores/confirmDelete/confirmDelete.store";
import { useShallow } from "zustand/shallow";
import { getTodayYYYYMMDD } from "@/utils/getToday";
import { useExecuteAction } from "@/hooks/useExecuteAction";
import { toast } from "react-toastify";
import { createCarMaintenanceAction, deleteCarMaintenanceAction, updateCarMaintenanceAction } from "../maintenance/mobilMaintenanceAction";

const defaultSort: SortingState = [{ id: "no", desc: false }];
const perawatanFormDefault: CarMaintenanceForm = {
  id_kendaraan: "",
  ket: "",
  tanggal: getTodayYYYYMMDD(),
}

const KendaraanMaintenance = ({
  data,
  idKendaraan,
}: {
  data: CarMaintenanceTable[],
  idKendaraan: string
}) => {
  const { setOpen: openConfirmDelete, isPosting } = useConfirmDelete(
    useShallow((state) => ({
      setOpen: state.setOpen,
      isPosting: state.isPosting,
    }))
  )

  const [showModal, setShowModal] = useState<boolean>(false);
  const [maintenanceForm, setMaintenanceForm] = useState<CarMaintenanceForm>({ ...perawatanFormDefault, id_kendaraan: idKendaraan });
  const [maintenanceOnEdit, setMaintenanceOnEdit] = useState<string>("");

  const { executeAction, isSuspense } = useExecuteAction();

  const onCloseModal = () => {
    setShowModal(false);
    setMaintenanceForm({ ...perawatanFormDefault, id_kendaraan: idKendaraan });
    setMaintenanceOnEdit("");
  }

  const createMaintenance = async (data: CarMaintenanceForm) => {
    await toast.promise(
      executeAction(createCarMaintenanceAction, data), {
      pending: "Membuat perawatan...",
      success: "Berhasil buat perawatan...",
      error: "Ooops... ada yang salah",
    })
  }

  const updateMaintenance = async (data: CarMaintenanceForm, id: BaseCarMaintenance["id"]) => {
    await toast.promise(
      executeAction(updateCarMaintenanceAction, data, id), {
      pending: "Update perawatan...",
      success: "Berhasil update perawatan...",
      error: "Ooops... ada yang salah",
    })
  }

  const onSubmit = async (payload: CarMaintenanceForm) => {
    if (maintenanceOnEdit === "") {
      await createMaintenance(payload);
    } else {
      await updateMaintenance(payload, maintenanceOnEdit);
    }

    onCloseModal();
  }

  const onUpdate = (id: BaseCarMaintenance["id"], data: CarMaintenanceForm) => {
    setMaintenanceOnEdit(id);
    setMaintenanceForm(data);
    setShowModal(true);
  }

  const onDelete = async (carMaintenanceId: BaseCarMaintenance["id"]) => {
    await toast.promise(
      executeAction(deleteCarMaintenanceAction, carMaintenanceId), {
      pending: "Menghapus perawatan...",
      success: "Berhasil hapus perawatan...",
      error: "Ooops... ada yang salah",
    })
  }

  return (
    <>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h3>Table Perawatan</h3>
        <Button type="button" variant="primary" onClick={() => setShowModal(true)}>
          <i className='bi bi-plus-lg'></i>
          <span style={{ marginLeft: "4px" }}>Tambah</span>
        </Button>
      </div>

      <DefaultTable<CarMaintenanceTable>
        columns={kendaraanMaintenanceColumns({
          deleteMaintenance: {
            openConfirmDelete: openConfirmDelete,
            onDelete: onDelete,
          },
          onUpdateMaintenance: onUpdate
        })}
        data={data}
        defaultSort={defaultSort}
        loading={isSuspense}
      />

      <Modal show={showModal} onHide={onCloseModal}>
        <Modal.Header>
          <Modal.Title>{maintenanceOnEdit === "" ? "Tambah" : "Edit"} Perawatan</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(maintenanceForm);
        }}>
          <Modal.Body>
            <Stack gap={2}>
              <Form.Group>
                <Form.Label>Keterangan</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={maintenanceForm.ket}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, ket: e.target.value }))}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Tanggal</Form.Label>
                <Form.Control
                  type="date"
                  required
                  value={maintenanceForm.tanggal}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, tanggal: e.target.value }))}
                />
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant='danger' onClick={onCloseModal}>Cancel</Button>
            <Button type="submit" variant='primary' disabled={isPosting}>Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default KendaraanMaintenance