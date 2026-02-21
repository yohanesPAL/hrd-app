'use client';
import { DivisionForm } from '@/modules/divisi/division.schema';
import { Dispatch, SetStateAction } from 'react';
import { Button, Form, Modal, Stack } from 'react-bootstrap'

const DivisiFormModal = ({
  show,
  isPosting,
  editingId,
  divisiForm,
  setDivisiForm,
  onCloseModal,
  onSubmit,
}: {
  show: boolean,
  isPosting: boolean,
  editingId: string,
  divisiForm: DivisionForm,
  setDivisiForm: Dispatch<SetStateAction<DivisionForm>>
  onCloseModal: () => void;
  onSubmit: (data: DivisionForm) => void;
}) => {

  return (
    <Modal show={show} onHide={onCloseModal}>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(divisiForm);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId === "" ? "Tambah" : "Update"} Divisi</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Stack gap={3}>
            <Form.Group>
              <Form.Label>Nama Divisi</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: Admin'
                required
                value={divisiForm.nama}
                onChange={(e) => setDivisiForm({ ...divisiForm, nama: e.currentTarget.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                required
                value={divisiForm.is_active ? 1 : 0}
                onChange={(e) => setDivisiForm({ ...divisiForm, is_active: e.currentTarget.value === "1" })}
              >
                <option value={1}>Aktif</option>
                <option value={0}>Non Aktif</option>
              </Form.Select>
            </Form.Group>
          </Stack>
        </Modal.Body>

        <Modal.Footer>
          <Button type='button' variant='danger' disabled={isPosting} onClick={onCloseModal}>Batal</Button>
          <Button type='submit' variant='primary' disabled={isPosting}>{editingId === "" ? "Submit" : "Update"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default DivisiFormModal