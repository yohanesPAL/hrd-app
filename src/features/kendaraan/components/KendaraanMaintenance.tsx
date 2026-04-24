"use client";
import DefaultTable from "@/components/Table/DefaulteTable";
import { BaseCarMaintenance, CarMaintenanceForm, CarMaintenanceTable } from "@/modules/car/maintenance/car.maintenance.schema";
import { SortingState } from "@tanstack/react-table";
import { kendaraanMaintenanceColumns } from "../columns/KendaraanMaintenanceColumns";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { useState } from "react";
import useConfirmDelete from "@/stores/confirmDelete/confirmDelete.store";
import { getTodayYYYYMMDD } from "@/utils/getToday";
import { createCarMaintenanceAction, deleteCarMaintenanceAction, updateCarMaintenanceAction } from "../maintenance/mobilMaintenanceAction";
import { useActionHandler } from "@/hooks/useActionHandler";

const defaultSort: SortingState = [{ id: "no", desc: false }];
const perawatanFormDefault: CarMaintenanceForm = {
  id_kendaraan: "",
  ket: "",
  tanggal: getTodayYYYYMMDD(),
}

const KendaraanMaintenance = ({
  maintenanceTable,
  carId,
}: {
  maintenanceTable: CarMaintenanceTable[],
  carId: string
}) => {
  const { openConfirmDelete } = useConfirmDelete()

  const [showModal, setShowModal] = useState<boolean>(false);
  const [maintenanceForm, setMaintenanceForm] = useState<CarMaintenanceForm>({ ...perawatanFormDefault, id_kendaraan: carId });
  const [maintenanceOnEdit, setMaintenanceOnEdit] = useState<string>("");
  const { run, isPending } = useActionHandler();

  const onModalClosed = () => {
    setShowModal(false);
    setMaintenanceForm({ ...perawatanFormDefault, id_kendaraan: carId });
    setMaintenanceOnEdit("");
  }

  const createMaintenance = async () => {
    await run(createCarMaintenanceAction, [maintenanceForm], {
      toast: {
        pending: "Membuat perawatan...",
        success: "Berhasil membuat perawatan",
        error: "Ooops... ada yang salah",
      },
      refresh: true,
    })
  }

  const updateMaintenance = async () => {
    await run(updateCarMaintenanceAction, [maintenanceForm, maintenanceOnEdit], {
      toast: {
        pending: "Update perawatan...",
        success: "Berhasil update perawatan...",
        error: "Ooops... ada yang salah",
      },
      refresh: true
    })
  }

  const onSubmit = async () => {
    try {
      if (maintenanceOnEdit === "") await createMaintenance();
      else await updateMaintenance();
    } finally {
      onModalClosed();
    }
  }

  const onEdit = (id: BaseCarMaintenance["id"], data: CarMaintenanceForm) => {
    setMaintenanceOnEdit(id);
    setMaintenanceForm(data);
    setShowModal(true);
  }

  const deleteMaintenance = async (maintenanceId: BaseCarMaintenance["id"]) => {
    await run(deleteCarMaintenanceAction, [maintenanceId], {
      toast: {
        pending: "Menghapus perawatan...",
        success: "Berhasil hapus perawatan...",
        error: "Ooops... ada yang salah",
      },
      refresh: true
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
        data={maintenanceTable}
        columns={kendaraanMaintenanceColumns({
          onDelete: (id, nama) => openConfirmDelete({ id, nama }, (id) => deleteMaintenance(id)),
          onEdit,
          isPending,
        })}
        defaultSort={defaultSort}
        loading={isPending}
      />

      <Modal show={showModal} onHide={onModalClosed}>
        <Modal.Header>
          <Modal.Title>{maintenanceOnEdit === "" ? "Tambah" : "Edit"} Perawatan</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
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
            <Button type="button" variant='danger' onClick={onModalClosed}>Cancel</Button>
            <Button type="submit" variant='primary' disabled={isPending}>Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default KendaraanMaintenance